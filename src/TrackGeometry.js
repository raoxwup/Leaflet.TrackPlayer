import * as turf from "@turf/turf";

// Distances and route topology are immutable for the lifetime of a player.
// Reuse them instead of scanning the full LineString on every animation frame.
export class TrackGeometry {
  constructor(coordinates) {
    this.coordinates = coordinates;
    this.distances = [0];
    for (let i = 1; i < coordinates.length; i++) {
      this.distances[i] =
        this.distances[i - 1] +
        turf.distance(coordinates[i - 1], coordinates[i]);
    }
    this.distance = this.distances[this.distances.length - 1];
    this.segmentIndex = -1;
    this.segment = null;
  }

  sample(distance) {
    const last = this.coordinates.length - 1;
    const travelled = Number.isFinite(distance)
      ? Math.max(0, Math.min(distance, this.distance))
      : 0;
    if (travelled >= this.distance) {
      return { index: last, coordinate: this.coordinates[last] };
    }

    let low = 0;
    let high = last;
    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      if (this.distances[middle] <= travelled) low = middle;
      else high = middle - 1;
    }
    const index = low;
    if (index !== this.segmentIndex) {
      this.segment = turf.lineString([
        this.coordinates[index],
        this.coordinates[index + 1],
      ]);
      this.segmentIndex = index;
    }
    return {
      index,
      coordinate: turf.along(this.segment, travelled - this.distances[index])
        .geometry.coordinates,
    };
  }
}
