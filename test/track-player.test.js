import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import * as turf from '@turf/turf';
import { TrackGeometry } from '../src/TrackGeometry.js';

const source = readFileSync(
  new URL('../src/TrackPlayer.js', import.meta.url),
  'utf8'
);

function fixture() {
  const frames = new Map();
  const layers = new Set();
  const calls = { arrows: 0, pan: 0, frame: 0 };
  let now = 1000;
  const latLng = (lat, lng) =>
    Array.isArray(lat)
      ? { lat: lat[0], lng: lat[1] }
      : typeof lat === 'object'
        ? lat
        : { lat, lng };
  const layer = (value = [], options = {}) => ({
    _latlngs: value.map((item) => latLng(item)),
    options,
    addTo() {
      layers.add(this);
      return this;
    },
    remove() {
      layers.delete(this);
    },
    setLatLngs(value) {
      this._latlngs = value.map((item) => latLng(item));
      return this;
    },
    getLatLngs() {
      return this._latlngs;
    },
    setLatLng(value) {
      this.position = latLng(value);
      return this;
    },
    setRotationAngle(value) {
      this.angle = value;
      return this;
    },
    setRotationOrigin(value) {
      this.origin = value;
      return this;
    },
    setPaths() {
      calls.arrows++;
    },
  });
  const L = {
    latLng,
    polyline: layer,
    marker: (_, options) => layer([], options),
    polylineDecorator: layer,
    Symbol: { arrowHead: (options) => options },
  };
  const math = {
    ...turf,
    lineSliceAlong() {
      throw new Error('Playback must not rescan the complete route');
    },
  };
  vm.runInNewContext(
    source.replace(/^import .*;\r?$/gm, ''),
    {
      L,
      turf: math,
      TrackGeometry,
      Date: { now: () => now },
      setTimeout,
      clearTimeout,
      requestAnimationFrame(callback) {
        const id = ++calls.frame;
        frames.set(id, callback);
        return id;
      },
      cancelAnimationFrame(id) {
        frames.delete(id);
      },
    },
    { filename: 'TrackPlayer.js' }
  );
  const map = {
    panTo() {
      calls.pan++;
    },
  };
  const coords = [
    [30, 114],
    [30.01, 114.01],
    [30.02, 114.02],
    [30.03, 114.03],
  ];
  const create = (track = coords, options = {}) =>
    new L.TrackPlayer(track, {
      markerIcon: {},
      panTo: false,
      ...options,
    }).addTo(map);
  const tick = (timestamp) => {
    now = timestamp;
    const pending = [...frames.values()];
    frames.clear();
    for (const callback of pending) callback(timestamp);
  };
  return { create, tick, frames, layers, calls, map };
}

test('local interpolation matches full-route Turf interpolation, including repeated points', () => {
  const coords = [
    [114, 30],
    [114.01, 30.02],
    [114.01, 30.02],
    [115, 31],
    [116, 32],
  ];
  const geometry = new TrackGeometry(coords);
  for (const fraction of [0, 0.001, 0.1, 0.5, 0.9, 1]) {
    const travelled = geometry.distance * fraction;
    const expected = turf.along(turf.lineString(coords), travelled).geometry
      .coordinates;
    const actual = geometry.sample(travelled).coordinate;
    assert.ok(Math.abs(actual[0] - expected[0]) < 1e-8);
    assert.ok(Math.abs(actual[1] - expected[1]) < 1e-8);
  }
  assert.equal(geometry.sample(geometry.distances[1]).index, 2);
  assert.equal(geometry.sample(-1).index, 0);
  assert.equal(geometry.sample(geometry.distance + 1).index, coords.length - 1);
});

test('a 10000-point route uses binary lookup and caches the current two-point segment', () => {
  const geometry = new TrackGeometry(
    Array.from({ length: 10000 }, (_, i) => [114 + i * 0.00001, 30])
  );
  let reads = 0;
  geometry.distances = new Proxy(geometry.distances, {
    get(target, key, receiver) {
      if (typeof key === 'string' && /^\d+$/.test(key)) reads++;
      return Reflect.get(target, key, receiver);
    },
  });
  const travelled = geometry.distance * 0.5;
  geometry.sample(travelled);
  assert.ok(reads < 25, `Read ${reads} distance entries`);
  const segment = geometry.segment;
  geometry.sample(travelled + 1e-8);
  assert.equal(geometry.segment, segment);
  assert.equal(segment.geometry.coordinates.length, 2);
});

test('playback keeps per-frame progress callbacks without rebuilding arrows or path buffers', () => {
  const f = fixture();
  const player = f.create();
  let events = 0;
  player.on('progress', (progress, position, index) => {
    events++;
    assert.ok(progress >= 0 && progress <= 1);
    assert.ok(Number.isFinite(position.lat));
    assert.equal(index, 0);
  });
  player.start();
  f.tick(1000);
  const passed = player._passedPath;
  const remaining = player._remainingPath;
  for (let i = 1; i <= 60; i++) f.tick(1000 + i);
  assert.equal(events, 61);
  assert.equal(f.calls.arrows, 0);
  assert.equal(player._passedPath, passed);
  assert.equal(player._remainingPath, remaining);
  assert.equal(
    player.passedLine.getLatLngs().at(-1).lat,
    player.markerPoint[0]
  );
  assert.equal(player.notPassedLine.getLatLngs()[0].lng, player.markerPoint[1]);
});

test('forward/backward seeking preserves the two original polyline colors and endpoints', () => {
  const f = fixture();
  const player = f.create(undefined, {
    passedLineColor: 'rgba(0,0,255,.5)',
    notPassedLineColor: 'red',
  });
  player.setProgress(0.75);
  assert.equal(player.options.progress, 0.75);
  const passed = player._passedPath;
  player.setProgress(0.2);
  assert.equal(player.options.progress, 0.2);
  assert.notEqual(player._passedPath, passed);
  assert.equal(player.passedLine.options.color, 'rgba(0,0,255,.5)');
  assert.equal(player.notPassedLine.options.color, 'red');
  assert.deepEqual(player.passedLine.getLatLngs()[0], { lat: 30, lng: 114 });
  assert.deepEqual(player.notPassedLine.getLatLngs().at(-1), {
    lat: 30.03,
    lng: 114.03,
  });
  assert.equal(f.layers.size, 4); // marker, two polylines, and the decorator
  assert.equal(f.calls.pan, 0);
});

test('both rendered paths match Turf slices across segments and backward seeks', () => {
  const f = fixture();
  const player = f.create([
    [70, 170],
    [71, 179],
    [71, 179],
    [72, -175],
    [70, -160],
  ]);
  const compact = (coordinates) =>
    coordinates.filter(
      (point, index) =>
        index === 0 ||
        point.some(
          (value, axis) => Math.abs(value - coordinates[index - 1][axis]) > 1e-8
        )
    );
  const compare = (line, expected) => {
    const actual = compact(line.getLatLngs().map(({ lng, lat }) => [lng, lat]));
    expected = compact(expected);
    assert.equal(actual.length, expected.length);
    actual.forEach((point, index) =>
      point.forEach((value, axis) =>
        assert.ok(Math.abs(value - expected[index][axis]) < 1e-8)
      )
    );
  };
  for (const progress of [0.1, 0.8, 0.4, 0.99, 0.01]) {
    player.setProgress(progress);
    const distance = player.distance * progress;
    compare(
      player.passedLine,
      turf.lineSliceAlong(player.track, 0, distance).geometry.coordinates
    );
    compare(
      player.notPassedLine,
      turf.lineSliceAlong(player.track, distance).geometry.coordinates
    );
  }
});

test('pause/resume cancels old animation frames and never duplicates the playback loop', () => {
  const f = fixture();
  const player = f.create();
  player.start();
  player.start();
  assert.equal(f.frames.size, 1);
  f.tick(1000);
  player.pause();
  assert.equal(f.frames.size, 0);
  player.start();
  assert.equal(f.frames.size, 1);
  f.tick(1016);
  assert.equal(f.frames.size, 1);
  player.remove();
  assert.equal(f.frames.size, 0);
  assert.equal(f.layers.size, 0);
});

test('end, replay, speed changes, and forced paused seeks keep their existing APIs', async () => {
  const f = fixture();
  const player = f.create();
  let finished = 0;
  player.on('finished', () => finished++);
  player.setProgress(1);
  assert.equal(finished, 1);
  assert.equal(player.trackIndex, 3);
  assert.equal(player.notPassedLine.getLatLngs().length, 0);
  player.start();
  f.tick(1000);
  assert.equal(player.options.progress, 0);
  assert.equal(player.finished, false);
  await player.setSpeed(900, 0);
  assert.equal(player.options.speed, 900);
  player.pause();
  player.setProgress(0.5);
  assert.equal(player.options.progress, 0.5);
  assert.equal(player.isPaused, true);
  assert.equal(f.frames.size, 0);
});

test('zero-distance tracks finish with finite coordinates and progress', () => {
  const f = fixture();
  const player = f.create([
    [30, 114],
    [30, 114],
  ]);
  player.start();
  f.tick(1000);
  assert.equal(player.options.progress, 1);
  assert.equal(player.finished, true);
  assert.ok(player.markerPoint.every(Number.isFinite));
  assert.equal(f.frames.size, 0);
});

test('initial progress and remove/re-add do not reuse stale path buffers', () => {
  const f = fixture();
  const player = f.create(undefined, { progress: 0.4 });
  assert.equal(player.options.progress, 0.4);
  const old = player._passedPath;
  player.remove();
  player.addTo(f.map);
  assert.equal(player.options.progress, 0.4);
  assert.notEqual(player._passedPath, old);
  assert.equal(f.layers.size, 4);
});
