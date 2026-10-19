var z = (e, s, t) => new Promise((a, o) => {
  var c = (u) => {
    try {
      p(t.next(u));
    } catch (g) {
      o(g);
    }
  }, l = (u) => {
    try {
      p(t.throw(u));
    } catch (g) {
      o(g);
    }
  }, p = (u) => u.done ? a(u.value) : Promise.resolve(u.value).then(c, l);
  p((t = t.apply(e, s)).next());
});
import _ from "leaflet";
var y = 63710088e-1, N = {
  centimeters: y * 100,
  centimetres: y * 100,
  degrees: y / 111325,
  feet: y * 3.28084,
  inches: y * 39.37,
  kilometers: y / 1e3,
  kilometres: y / 1e3,
  meters: y,
  metres: y,
  miles: y / 1609.344,
  millimeters: y * 1e3,
  millimetres: y * 1e3,
  nauticalmiles: y / 1852,
  radians: 1,
  yards: y * 1.0936
};
function U(e, s, t) {
  t === void 0 && (t = {});
  var a = { type: "Feature" };
  return (t.id === 0 || t.id) && (a.id = t.id), t.bbox && (a.bbox = t.bbox), a.properties = s || {}, a.geometry = e, a;
}
function M(e, s, t) {
  if (t === void 0 && (t = {}), !e)
    throw new Error("coordinates is required");
  if (!Array.isArray(e))
    throw new Error("coordinates must be an Array");
  if (e.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!B(e[0]) || !B(e[1]))
    throw new Error("coordinates must contain numbers");
  var a = {
    type: "Point",
    coordinates: e
  };
  return U(a, s, t);
}
function H(e, s, t) {
  if (t === void 0 && (t = {}), e.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  var a = {
    type: "LineString",
    coordinates: e
  };
  return U(a, s, t);
}
function q(e, s) {
  s === void 0 && (s = "kilometers");
  var t = N[s];
  if (!t)
    throw new Error(s + " units is invalid");
  return e * t;
}
function V(e, s) {
  s === void 0 && (s = "kilometers");
  var t = N[s];
  if (!t)
    throw new Error(s + " units is invalid");
  return e / t;
}
function F(e) {
  var s = e % (2 * Math.PI);
  return s * 180 / Math.PI;
}
function v(e) {
  var s = e % 360;
  return s * Math.PI / 180;
}
function B(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function S(e) {
  if (!e)
    throw new Error("coord is required");
  if (!Array.isArray(e)) {
    if (e.type === "Feature" && e.geometry !== null && e.geometry.type === "Point")
      return e.geometry.coordinates;
    if (e.type === "Point")
      return e.coordinates;
  }
  if (Array.isArray(e) && e.length >= 2 && !Array.isArray(e[0]) && !Array.isArray(e[1]))
    return e;
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function Z(e) {
  return e.type === "Feature" ? e.geometry : e;
}
var J = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
function G(e, s, t) {
  t === void 0 && (t = {});
  var a = S(e), o = S(s), c = v(o[1] - a[1]), l = v(o[0] - a[0]), p = v(a[1]), u = v(o[1]), g = Math.pow(Math.sin(c / 2), 2) + Math.pow(Math.sin(l / 2), 2) * Math.cos(p) * Math.cos(u);
  return q(2 * Math.atan2(Math.sqrt(g), Math.sqrt(1 - g)), t.units);
}
function K(e, s, t, a) {
  a === void 0 && (a = {});
  var o = S(e), c = v(o[0]), l = v(o[1]), p = v(t), u = V(s, a.units), g = Math.asin(Math.sin(l) * Math.cos(u) + Math.cos(l) * Math.sin(u) * Math.cos(p)), P = c + Math.atan2(Math.sin(p) * Math.sin(u) * Math.cos(l), Math.cos(u) - Math.sin(l) * Math.sin(g)), A = F(P), x = F(g);
  return M([A, x], a.properties);
}
function R(e, s, t) {
  if (t === void 0 && (t = {}), t.final === !0)
    return Q(e, s);
  var a = S(e), o = S(s), c = v(a[0]), l = v(o[0]), p = v(a[1]), u = v(o[1]), g = Math.sin(l - c) * Math.cos(u), P = Math.cos(p) * Math.sin(u) - Math.sin(p) * Math.cos(u) * Math.cos(l - c);
  return F(Math.atan2(g, P));
}
function Q(e, s) {
  var t = R(s, e);
  return t = (t + 180) % 360, t;
}
function W(e, s, t) {
  t === void 0 && (t = {});
  for (var a = Z(e), o = a.coordinates, c = 0, l = 0; l < o.length && !(s >= c && l === o.length - 1); l++)
    if (c >= s) {
      var p = s - c;
      if (p) {
        var u = R(o[l], o[l - 1]) - 180, g = K(o[l], p, u, t);
        return g;
      } else
        return M(o[l]);
    } else
      c += G(o[l], o[l + 1], t);
  return M(o[o.length - 1]);
}
(function(e, s) {
  (function(t, a) {
    a(_);
  })(J, function(t) {
    t = t && t.hasOwnProperty("default") ? t.default : t;
    function a(n, i) {
      var r = i.x - n.x, h = i.y - n.y;
      return Math.sqrt(r * r + h * h);
    }
    var o = function(i, r) {
      return (Math.atan2(r.y - i.y, r.x - i.x) * 180 / Math.PI + 90 + 360) % 360;
    }, c = function(i, r) {
      var h = i.value, d = i.isInPixels;
      return d ? h / r : h;
    };
    function l(n) {
      if (typeof n == "string" && n.indexOf("%") !== -1)
        return {
          value: parseFloat(n) / 100,
          isInPixels: !1
        };
      var i = n ? parseFloat(n) : 0;
      return {
        value: i,
        isInPixels: i > 0
      };
    }
    var p = function(i, r) {
      return i.x === r.x && i.y === r.y;
    };
    function u(n) {
      return n.reduce(function(i, r, h, d) {
        if (h > 0 && !p(r, d[h - 1])) {
          var f = d[h - 1], m = i.length > 0 ? i[i.length - 1].distB : 0, w = a(f, r);
          i.push({
            a: f,
            b: r,
            distA: m,
            distB: m + w,
            heading: o(f, r)
          });
        }
        return i;
      }, []);
    }
    function g(n, i) {
      var r = u(n), h = r.length;
      if (h === 0)
        return [];
      var d = r[h - 1].distB, f = c(i.offset, d), m = c(i.endOffset, d), w = c(i.repeat, d), k = d * w, T = f > 0 ? d * f : 0, O = m > 0 ? d * m : 0, D = [], I = T;
      do
        D.push(I), I += k;
      while (k > 0 && I < d - O);
      var E = 0, b = r[0];
      return D.map(function(C) {
        for (; C > b.distB && E < h - 1; )
          E++, b = r[E];
        var j = (C - b.distA) / (b.distB - b.distA);
        return {
          pt: P(b.a, b.b, j),
          heading: b.heading
        };
      });
    }
    function P(n, i, r) {
      return i.x !== n.x ? {
        x: n.x + r * (i.x - n.x),
        y: n.y + r * (i.y - n.y)
      } : {
        x: n.x,
        y: n.y + (i.y - n.y) * r
      };
    }
    (function() {
      var n = L.Marker.prototype._initIcon, i = L.Marker.prototype._setPos, r = L.DomUtil.TRANSFORM === "msTransform";
      L.Marker.addInitHook(function() {
        var h = this.options.icon && this.options.icon.options, d = h && this.options.icon.options.iconAnchor;
        d && (d = d[0] + "px " + d[1] + "px"), this.options.rotationOrigin = this.options.rotationOrigin || d || "center bottom", this.options.rotationAngle = this.options.rotationAngle || 0, this.on("drag", function(f) {
          f.target._applyRotation();
        });
      }), L.Marker.include({
        _initIcon: function() {
          n.call(this);
        },
        _setPos: function(h) {
          i.call(this, h), this._applyRotation();
        },
        _applyRotation: function() {
          this.options.rotationAngle && (this._icon.style[L.DomUtil.TRANSFORM + "Origin"] = this.options.rotationOrigin, r ? this._icon.style[L.DomUtil.TRANSFORM] = "rotate(" + this.options.rotationAngle + "deg)" : this._icon.style[L.DomUtil.TRANSFORM] += " rotateZ(" + this.options.rotationAngle + "deg)");
        },
        setRotationAngle: function(h) {
          return this.options.rotationAngle = h, this.update(), this;
        },
        setRotationOrigin: function(h) {
          return this.options.rotationOrigin = h, this.update(), this;
        }
      });
    })(), t.Symbol = t.Symbol || {}, t.Symbol.Dash = t.Class.extend({
      options: {
        pixelSize: 10,
        pathOptions: {}
      },
      initialize: function(i) {
        t.Util.setOptions(this, i), this.options.pathOptions.clickable = !1;
      },
      buildSymbol: function(i, r, h, d, f) {
        var m = this.options, w = Math.PI / 180;
        if (m.pixelSize <= 1)
          return t.polyline([i.latLng, i.latLng], m.pathOptions);
        var k = h.project(i.latLng), T = -(i.heading - 90) * w, O = t.point(k.x + m.pixelSize * Math.cos(T + Math.PI) / 2, k.y + m.pixelSize * Math.sin(T) / 2), D = k.add(k.subtract(O));
        return t.polyline([h.unproject(O), h.unproject(D)], m.pathOptions);
      }
    }), t.Symbol.dash = function(n) {
      return new t.Symbol.Dash(n);
    }, t.Symbol.ArrowHead = t.Class.extend({
      options: {
        polygon: !0,
        pixelSize: 10,
        headAngle: 60,
        pathOptions: {
          stroke: !1,
          weight: 2
        }
      },
      initialize: function(i) {
        t.Util.setOptions(this, i), this.options.pathOptions.clickable = !1;
      },
      buildSymbol: function(i, r, h, d, f) {
        return this.options.polygon ? t.polygon(this._buildArrowPath(i, h), this.options.pathOptions) : t.polyline(this._buildArrowPath(i, h), this.options.pathOptions);
      },
      _buildArrowPath: function(i, r) {
        var h = Math.PI / 180, d = r.project(i.latLng), f = -(i.heading - 90) * h, m = this.options.headAngle / 2 * h, w = f + m, k = f - m, T = t.point(d.x - this.options.pixelSize * Math.cos(w), d.y + this.options.pixelSize * Math.sin(w)), O = t.point(d.x - this.options.pixelSize * Math.cos(k), d.y + this.options.pixelSize * Math.sin(k));
        return [r.unproject(T), i.latLng, r.unproject(O)];
      }
    }), t.Symbol.arrowHead = function(n) {
      return new t.Symbol.ArrowHead(n);
    }, t.Symbol.Marker = t.Class.extend({
      options: {
        markerOptions: {},
        rotate: !1
      },
      initialize: function(i) {
        t.Util.setOptions(this, i), this.options.markerOptions.clickable = !1, this.options.markerOptions.draggable = !1;
      },
      buildSymbol: function(i, r, h, d, f) {
        return this.options.rotate && (this.options.markerOptions.rotationAngle = i.heading + (this.options.angleCorrection || 0)), t.marker(i.latLng, this.options.markerOptions);
      }
    }), t.Symbol.marker = function(n) {
      return new t.Symbol.Marker(n);
    };
    var A = function(i) {
      return i instanceof t.LatLng || Array.isArray(i) && i.length === 2 && typeof i[0] == "number";
    }, x = function(i) {
      return Array.isArray(i) && A(i[0]);
    };
    t.PolylineDecorator = t.FeatureGroup.extend({
      options: {
        patterns: []
      },
      initialize: function(i, r) {
        t.FeatureGroup.prototype.initialize.call(this), t.Util.setOptions(this, r), this._map = null, this._paths = this._initPaths(i), this._bounds = this._initBounds(), this._patterns = this._initPatterns(this.options.patterns);
      },
      /**
      * Deals with all the different cases. input can be one of these types:
      * array of LatLng, array of 2-number arrays, Polyline, Polygon,
      * array of one of the previous.
      */
      _initPaths: function(i, r) {
        var h = this;
        if (x(i)) {
          var d = r ? i.concat([i[0]]) : i;
          return [d];
        }
        return i instanceof t.Polyline ? this._initPaths(i.getLatLngs(), i instanceof t.Polygon) : Array.isArray(i) ? i.reduce(function(f, m) {
          return f.concat(h._initPaths(m, r));
        }, []) : [];
      },
      // parse pattern definitions and precompute some values
      _initPatterns: function(i) {
        return i.map(this._parsePatternDef);
      },
      /**
      * Changes the patterns used by this decorator
      * and redraws the new one.
      */
      setPatterns: function(i) {
        this.options.patterns = i, this._patterns = this._initPatterns(this.options.patterns), this.redraw();
      },
      /**
      * Changes the patterns used by this decorator
      * and redraws the new one.
      */
      setPaths: function(i) {
        this._paths = this._initPaths(i), this._bounds = this._initBounds(), this.redraw();
      },
      /**
      * Parse the pattern definition
      */
      _parsePatternDef: function(i, r) {
        return {
          symbolFactory: i.symbol,
          // Parse offset and repeat values, managing the two cases:
          // absolute (in pixels) or relative (in percentage of the polyline length)
          offset: l(i.offset),
          endOffset: l(i.endOffset),
          repeat: l(i.repeat)
        };
      },
      onAdd: function(i) {
        this._map = i, this._draw(), this._map.on("moveend", this.redraw, this);
      },
      onRemove: function(i) {
        this._map.off("moveend", this.redraw, this), this._map = null, t.FeatureGroup.prototype.onRemove.call(this, i);
      },
      /**
      * As real pattern bounds depends on map zoom and bounds,
      * we just compute the total bounds of all paths decorated by this instance.
      */
      _initBounds: function() {
        var i = this._paths.reduce(function(r, h) {
          return r.concat(h);
        }, []);
        return t.latLngBounds(i);
      },
      getBounds: function() {
        return this._bounds;
      },
      /**
      * Returns an array of ILayers object
      */
      _buildSymbols: function(i, r, h) {
        var d = this;
        return h.map(function(f, m) {
          return r.buildSymbol(f, i, d._map, m, h.length);
        });
      },
      /**
      * Compute pairs of LatLng and heading angle,
      * that define positions and directions of the symbols on the path
      */
      _getDirectionPoints: function(i, r) {
        var h = this;
        if (i.length < 2)
          return [];
        var d = i.map(function(f) {
          return h._map.project(f);
        });
        return g(d, r).map(function(f) {
          return {
            latLng: h._map.unproject(t.point(f.pt)),
            heading: f.heading
          };
        });
      },
      redraw: function() {
        this._map && (this.clearLayers(), this._draw());
      },
      /**
      * Returns all symbols for a given pattern as an array of FeatureGroup
      */
      _getPatternLayers: function(i) {
        var r = this, h = this._map.getBounds().pad(0.1);
        return this._paths.map(function(d) {
          var f = r._getDirectionPoints(d, i).filter(function(m) {
            return h.contains(m.latLng);
          });
          return t.featureGroup(r._buildSymbols(d, i.symbolFactory, f));
        });
      },
      /**
      * Draw all patterns
      */
      _draw: function() {
        var i = this;
        this._patterns.map(function(r) {
          return i._getPatternLayers(r);
        }).forEach(function(r) {
          i.addLayer(t.featureGroup(r));
        });
      }
    }), t.polylineDecorator = function(n, i) {
      return new t.PolylineDecorator(n, i);
    };
  });
})();
(function() {
  var e = L.Marker.prototype._initIcon, s = L.Marker.prototype._setPos, t = L.DomUtil.TRANSFORM === "msTransform";
  L.Marker.addInitHook(function() {
    var a = this.options.icon && this.options.icon.options, o = a && this.options.icon.options.iconAnchor;
    o && (o = o[0] + "px " + o[1] + "px"), this.options.rotationOrigin = this.options.rotationOrigin || o || "center bottom", this.options.rotationAngle = this.options.rotationAngle || 0, this.on("drag", function(c) {
      c.target._applyRotation();
    });
  }), L.Marker.include({
    _initIcon: function() {
      e.call(this);
    },
    _setPos: function(a) {
      s.call(this, a), this._applyRotation();
    },
    _applyRotation: function() {
      this.options.rotationAngle && (this._icon.style[L.DomUtil.TRANSFORM + "Origin"] = this.options.rotationOrigin, t ? this._icon.style[L.DomUtil.TRANSFORM] = "rotate(" + this.options.rotationAngle + "deg)" : this._icon.style[L.DomUtil.TRANSFORM] += " rotateZ(" + this.options.rotationAngle + "deg)");
    },
    setRotationAngle: function(a) {
      return this.options.rotationAngle = a, this.update(), this;
    },
    setRotationOrigin: function(a) {
      return this.options.rotationOrigin = a, this.update(), this;
    }
  });
})();
class X {
  constructor(s) {
    this.coordinates = s, this.distances = [0];
    for (let t = 1; t < s.length; t++)
      this.distances[t] = this.distances[t - 1] + G(s[t - 1], s[t]);
    this.distance = this.distances[this.distances.length - 1], this.segmentIndex = -1, this.segment = null;
  }
  sample(s) {
    const t = this.coordinates.length - 1, a = Number.isFinite(s) ? Math.max(0, Math.min(s, this.distance)) : 0;
    if (a >= this.distance)
      return { index: t, coordinate: this.coordinates[t] };
    let o = 0, c = t;
    for (; o < c; ) {
      const p = Math.ceil((o + c) / 2);
      this.distances[p] <= a ? o = p : c = p - 1;
    }
    const l = o;
    return l !== this.segmentIndex && (this.segment = H([
      this.coordinates[l],
      this.coordinates[l + 1]
    ]), this.segmentIndex = l), {
      index: l,
      coordinate: W(this.segment, a - this.distances[l]).geometry.coordinates
    };
  }
}
_.TrackPlayer = class {
  constructor(e, s = {}) {
    var a, o, c, l, p, u, g, P, A, x;
    let t = _.polyline(e)._latlngs;
    this.track = H(
      t.map(({ lng: n, lat: i }) => [n, i])
    ), this._geometry = new X(this.track.geometry.coordinates), this.distanceSlice = this._geometry.distances, this.distance = this._geometry.distance, this._latlngs = t, this._renderIndex = -1, this.addedToMap = !1, this.options = {
      speed: (a = s.speed) != null ? a : 600,
      weight: (o = s.weight) != null ? o : 8,
      markerIcon: s.markerIcon,
      polylineDecoratorOptions: (c = s.polylineDecoratorOptions) != null ? c : {
        patterns: [
          {
            offset: 30,
            repeat: 60,
            symbol: _.Symbol.arrowHead({
              pixelSize: 5,
              headAngle: 75,
              polygon: !1,
              pathOptions: { stroke: !0, weight: 3, color: "#fff" }
            })
          }
        ]
      },
      passedLineColor: (l = s.passedLineColor) != null ? l : "#0000ff",
      notPassedLineColor: (p = s.notPassedLineColor) != null ? p : "#ff0000",
      panTo: (u = s.panTo) != null ? u : !0,
      markerRotationOrigin: (g = s.markerRotationOrigin) != null ? g : "center",
      markerRotationOffset: (P = s.markerRotationOffset) != null ? P : 0,
      markerRotation: (A = s.markerRotation) != null ? A : !0,
      progress: (x = s.progress) != null ? x : 0
    }, this.initProgress = s.progress, this.isPaused = !0, this.walkedDistance = 0, this.walkedDistanceTemp = 0, this.trackIndex = 0, this.listenedEvents = {
      start: [],
      pause: [],
      finished: [],
      progressCallback: []
    };
  }
  addTo(e) {
    if (this.addedToMap) return;
    if (this.map = e, this.addedToMap = !0, this.options.markerIcon) {
      let t = this.track.geometry.coordinates[0];
      if (this.marker = _.marker([t[1], t[0]], {
        icon: this.options.markerIcon
      }).addTo(this.map), this.options.markerRotation) {
        let a = this.track.geometry.coordinates;
        this.marker.setRotationAngle(
          R(a[0], a[1]) / 2 + this.options.markerRotationOffset / 2
        ), this.marker.setRotationOrigin(
          this.options.markerRotationOrigin
        );
      }
    }
    let s = this.track.geometry.coordinates.map(([t, a]) => [a, t]);
    return this.notPassedLine = _.polyline(s, {
      weight: this.options.weight,
      color: this.options.notPassedLineColor
    }).addTo(this.map), this.passedLine = _.polyline([], {
      weight: this.options.weight,
      color: this.options.passedLineColor
    }).addTo(this.map), this.polylineDecorator = _.polylineDecorator(
      s,
      this.options.polylineDecoratorOptions
    ).addTo(this.map), this.initProgress && this.setProgress(this.initProgress), this;
  }
  remove() {
    this.addedToMap && (cancelAnimationFrame(this._animationFrame), this._animationFrame = void 0, this.addedToMap = !1, this.polylineDecorator.remove(), this.polylineDecorator = null, this.notPassedLine.remove(), this.notPassedLine = null, this.passedLine.remove(), this.passedLine = null, this.marker && (this.marker.remove(), this.marker = null), this.finished = !1, this.startTimestamp = 0, this.pauseTimestamp = 0, this.walkedDistanceTemp = 0, this.walkedDistance = 0, this.trackIndex = 0, this._renderIndex = -1, this._passedPath = null, this._remainingPath = null, this.isPaused = !0, this.options.progress = this.initProgress);
  }
  start() {
    !this.isPaused && !this.finished || !this.addedToMap || ((this.options.progress === 0 || this.options.progress === 1) && (this.startTimestamp = 0, this.pauseTimestamp = 0, this.walkedDistanceTemp = 0, this.walkedDistance = 0), this.isPaused = !1, this.finished = !1, this.pauseTimestamp && this.startTimestamp && (this.startTimestamp = this.startTimestamp + (Date.now() - this.pauseTimestamp)), this.startAction(), this.listenedEvents.start.forEach((e) => e()), this.initProgress && this.setProgress(this.initProgress));
  }
  pause() {
    this.isPaused || this.finished || (cancelAnimationFrame(this._animationFrame), this._animationFrame = void 0, this.pauseTimestamp = Date.now(), this.isPaused = !0, this.listenedEvents.pause.forEach((e) => e()));
  }
  startAction() {
    cancelAnimationFrame(this._animationFrame);
    let e = this.distance, s = (t) => {
      if (this._animationFrame = void 0, !(!this.addedToMap || this.isPaused || this.finished)) {
        if (t && this.addedToMap) {
          let a = e / this.options.speed * 3600 * 1e3;
          this.startTimestamp || (this.startTimestamp = t);
          let o = t - this.startTimestamp;
          this.walkedDistance = e === 0 ? 0 : e * (o / a) + this.walkedDistanceTemp, this.playAction();
        }
        !this.isPaused && !this.finished && (this._animationFrame = requestAnimationFrame(s));
      }
    };
    s();
  }
  playAction(e = !1) {
    if (!this.addedToMap || this.isPaused && !e) return;
    let s = this.distance;
    const t = this._geometry.sample(this.walkedDistance);
    this.trackIndex = t.index;
    let [a, o] = t.coordinate;
    this.markerPoint = [o, a], this.options.panTo && this.map.panTo(this.markerPoint, {
      animate: !1
    }), this.marker && this.marker.setLatLng(this.markerPoint);
    const c = _.latLng(o, a), l = this._latlngs.length - 1;
    if (this._renderIndex !== this.trackIndex ? (this._passedPath = this._latlngs.slice(0, this.trackIndex + 1), this._remainingPath = this.trackIndex < l ? [c, ...this._latlngs.slice(this.trackIndex + 1)] : [], this.trackIndex < l && this._passedPath.push(c), this._renderIndex = this.trackIndex) : this.trackIndex < l && (this._passedPath[this._passedPath.length - 1] = c, this._remainingPath[0] = c), this.walkedDistance >= s ? this.notPassedLine.setLatLngs([]) : this.notPassedLine.setLatLngs(this._remainingPath), this.walkedDistance > 0 ? this.passedLine.setLatLngs(this._passedPath) : this.passedLine.setLatLngs([]), this.trackIndex < l && this.walkedDistance < s && this.options.markerRotation && this.marker) {
      let p = 0;
      p = R(
        M([a, o]),
        M(
          this.track.geometry.coordinates[this.trackIndex + 1]
        )
      ), this.marker.setRotationAngle(
        p / 2 + this.options.markerRotationOffset / 2
      );
    }
    if (this.options.progress = s > 0 ? Math.min(1, this.walkedDistance / s) : 1, this.listenedEvents.progressCallback.forEach(
      (p) => p(
        this.options.progress,
        _.latLng(...this.markerPoint),
        this.trackIndex
      )
    ), this.walkedDistance >= s && (this.walkedDistance = s, this.finished = !0, this.listenedEvents.finished.forEach((p) => p()), this.options.markerRotation && this.marker)) {
      let p = this.track.geometry.coordinates, u = R(
        M(p.at(-2)),
        M(p.at(-1))
      );
      this.marker.setRotationAngle(
        u / 2 + this.options.markerRotationOffset / 2
      );
    }
  }
  setSpeedAction(e) {
    this.options.speed = e, this.walkedDistanceTemp = this.walkedDistance, this.startTimestamp = 0;
  }
  setSpeed(e, s = 20) {
    return z(this, null, function* () {
      s && (clearTimeout(this.setSpeedTimeout), yield new Promise((t) => {
        this.setSpeedTimeout = setTimeout(t, s);
      })), this.setSpeedAction(e);
    });
  }
  setProgress(e) {
    this.addedToMap && (this.options.progress == 1 && e == 1 || this.options.progress == 0 && e == 0 || (this.options.progress = e, this.walkedDistanceTemp = this.distance * e, this.startTimestamp = 0, (this.isPaused || this.finished) && (this.walkedDistance = this.walkedDistanceTemp, this.isPaused ? this.playAction(!0) : (this.finished = !1, this.isPaused = !1, this.startAction()))));
  }
  on(e, s) {
    switch (e) {
      case "start":
        this.listenedEvents.start.push(s);
        break;
      case "pause":
        this.listenedEvents.pause.push(s);
        break;
      case "finished":
        this.listenedEvents.finished.push(s);
        break;
      case "progress":
        this.listenedEvents.progressCallback.push(s);
        break;
    }
  }
  off(e, s) {
    if (!s) {
      this.listenedEvents[e] = [];
      return;
    }
    switch (e) {
      case "start":
        this.listenedEvents.start = this.listenedEvents.start.filter(
          (t) => t !== s
        );
        break;
      case "pause":
        this.listenedEvents.pause = this.listenedEvents.pause.filter(
          (t) => t !== s
        );
        break;
      case "finished":
        this.listenedEvents.finished = this.listenedEvents.finished.filter(
          (t) => t !== s
        );
        break;
      case "progress":
        this.listenedEvents.progressCallback = this.listenedEvents.progressCallback.filter(
          (t) => t !== s
        );
        break;
    }
  }
};
