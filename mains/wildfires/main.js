/*
Main wildfire report
2017. G. Szep
 */

/////////////////////////////////////////////////////////////////////////
// importing wildfire data

var fs = require('fs')
const csvJSON = require('./lib/csv')

var csvString = fs.readFileSync(__dirname+'/usa-wildfires.csv','utf8')
var wildfires = csvJSON(csvString)
wildfires.splice(-1,1)

/////////////////////////////////////////////////////////////////////////
// dataviewer

var ol_Map = require('ol/map').default
var ol_View = require('ol/view').default

var ol_layer_Tile = require('ol/layer/tile').default
var ol_source_OSM = require('ol/source/osm').default

var ol_layer_Vector = require('ol/layer/vector').default
var ol_source_Vector = require('ol/source/vector').default

var ol_Collection = require('ol/collection').default
var ol_Feature = require('ol/feature').default
var ol_geom_Point = require('ol/geom/point').default


var osm = new ol_layer_Tile({
	source: new ol_source_OSM({wrapX: false})
})

var view = new ol_View({
	projection: 'EPSG:4326',
	center: [-95,37],
	zoom: 3
})

var map = new ol_Map({
	target: 'map',
	layers: [osm],
	view: view
})

var features = new ol_Collection()
var vectors = new ol_source_Vector({
	features: features,
	wrapX: false
})

var segments = new ol_layer_Vector({
	source: vectors
})

map.addLayer(segments)

/////////////////////////////////////////////////////////////////////////

var nFires = wildfires.length-1;
var delay = 25;

( function delayedLoop (i) {
	setTimeout( () => {
		var fire = wildfires[i]

		var geometry = new ol_geom_Point([fire.Longitude,fire.Latitude])
		var feature = new ol_Feature({ area:1, geometry: geometry })

		feature.setId(i)
		vectors.addFeature(feature)

		if (0 < i) delayedLoop(i-1)
	}, delay)
})(nFires)


/////////////////////////////////////////////////////////////////////////
var d3 = require('d3')
var nj = require('numjs')
