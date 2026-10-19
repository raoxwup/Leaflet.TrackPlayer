
# Leafelt.TrackPlayer
- - -
**language:** [English](README.md) / [简体中文](README.zh-CN.md)
- - -
A Leaflet track playback plugin, enabling you to swiftly create stunning track replay functionality.  
一个leaflet轨迹回放插件，帮助你快速构建出精美的轨迹回放功能。
- - -
![](https://github.com/weijun-lab/Leaflet.TrackPlayer/blob/master/examples/lib/assets/demo.gif?raw=true)
## 🎨Live Demo
<https://weijun-lab.github.io/Leaflet.TrackPlayer/>
## Installation
* `npm install leaflet-trackplayer`
* Or download the repository
## Usage
### ESM(ECMAScript Modules)
```js
import  "leaflet-trackplayer";
```
### UMD(Universal Module Definition)
```html
<script src="Leaflet.TrackPlayer/dist/leaflet-trackplayer.umd.cjs"></script>
```
---
```js
let track = new L.TrackPlayer(latlngs, options).addTo(map)
```
## Code Example
```js
let latlngs = [
       [
           34.291120985630914,
           108.91770583134237
       ],
       [
           34.29428596006031,
           108.9177058265846
       ],
];
let track = new L.TrackPlayer(latlngs, {
        markerIcon: L.icon({
          iconUrl: "Your image url",
        }),
        markerRotation: false,
}).addTo(map);
track.start();
track.on("progress",(progress, { lng, lat },index)=>{{
    console.log(`progress:${progress} - position:${lng},${lat} - trackIndex:${index}`)
})
```
## Documentation
### Latlngs
An array of latitude and longitude data for the trajectory, which is the same as the first parameter for `L.polyline`.
### Options
| Options | Type | Default | Description |
| --- | --- | --- | --- |
| **speed** | Number | 600 | Travel speed (km/h)
| **weight** | Number | 8 | Width of the trajectory line |
| **markerIcon** | L.icon | - | The icon of the moving marker during playback has a value equivalent to the 'icon' property of the `L.marker`. |
| **polylineDecoratorOptions** | Object | {...} | Arrowhead styles for the trajectory line, see[Leaflet.PolylineDecorator](https://github.com/bbecquet/Leaflet.PolylineDecorator) |
| **passedLineColor** | String | #0000ff | Color of the traveled portion of the trajectory line |
| **notPassedLineColor** | String | #ff0000 | Color of the untraveled portion of the trajectory line |
| **panTo** | Boolean | true | Whether the map view follows the moving marke |
| **markerRotation** | Boolean | true | Whether the marker auto-rotates according to the direction of movement |
| **markerRotationOrigin** | String | center | The rotation origin of the marker, follows the CSS `transform-origin` rule |
| **markerRotationOffset** | Number | 0 | The angle offset for marker rotation |
### Methods
| Methods | Return | Description |
| --- | --- | --- |
| start() | - | Start playback |
| pause() | - | Pause playback |
| setSpeed(`<Number> speed,<Number> debounceTimeout?`) | - | Set the playback speed (km/h) |
| setProgress(`<Number> progress`) | - | Set the playback progress value to 0-1|
| addTo(`<Map> map`) | this | Adds the track player to the map |
| remove() | - | Removes the track player from the map |
| on(`<String> type,<Function> fn`) | - | Adds a listener function to the specified event type |
| off(`<String> type,<Function> fn？`) | - | Removes the passed-in listener function. If no function is specified, removes all listeners for the event type. |
### Event
| Event | Description |
| --- | --- |
| **start** | Triggered when playback starts
| **pause** | Triggered when playback is paused
| **finished** | Triggered when playback completes
| **progress** | Triggered during playback; receives the `progress(0-1)` and `current location` and `track array index` in the callback function
## Properties
| Properties | Type | Description |
| --- | --- | --- |
|**marker**| L.marker | Moving marker on the trajectory |
|**passedLine**| L.polyline | The traveled part of the trajectory line |
|**notPassedLine**| L.polyline | The untraveled part of the trajectory line |
|**polylineDecorator**| L.polylineDecorator | The arrowhead-decorated polyline |
|**options**| Object | Configuration options |
## Playback performance and validation

Playback caches cumulative distances and uses binary search to locate the current
segment. Turf interpolation runs on that two-point segment. The traveled and
untraveled coordinate buffers are rebuilt only when the current record changes.
Direction arrows keep the complete route and redraw on map changes instead of
being rebuilt on every progress update. Pause and removal cancel pending
animation frames.

The existing methods, options, per-frame `progress` callback, and the two public
`passedLine` / `notPassedLine` polylines are retained, including their independent
colors and transparency. Applications can upgrade the library without changing
their playback integration. Leaflet still updates both polylines each frame;
rendering cost still depends on the route length and map renderer.

Use Node.js 18 or newer to run the regression tests:

```sh
npm ci
npm test
npm run build
```

To compare the original 2.0.4 build with the current build in a real browser:

```sh
npm run benchmark:prepare
npm run benchmark:serve
```

The preparation script reads baseline commit
`e2fabee4de627259ac94779cfce2ce67ef21a58d` from Git history. The generated baseline
bundle is ignored by Git. In the test page, run **Original 2.0.4**, **Optimized**,
and **Check compatibility**.

One local run with 10,000 synthetic points and 120 updates measured 1,421.3 ms
before and 672.1 ms after (about 53% less cumulative JavaScript update time).
Both runs kept the same per-frame popup callback, with map following and marker
rotation disabled. This measures synchronous playback updates, excludes initial
construction and asynchronous rendering, and does not predict full-page speed
or performance on other devices and routes. The page also reports frame
intervals and arrow rebuild counts for comparison.

# 🎉Acknowledgements & References
I gratitude to the following open-source plugins, which have provided essential support for the functionality.
* [turf](https://github.com/Turfjs/turf) A modular geospatial engine written in JavaScript
* [Leaflet.PolylineDecorator](https://github.com/bbecquet/Leaflet.PolylineDecorator) Defines and draws patterns along existing polylines or coordinate paths
* [Leaflet.RotatedMarker](https://github.com/bbecquet/Leaflet.RotatedMarker) Provides rotation functionality for markers in Leaflet

