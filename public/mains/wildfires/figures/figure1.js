// [Fig.1] - Spatial distribution of wildfires in the USA

/* global ol d3 */
import delayedLoop from '../lib/loop.js'

var osm = new ol.layer.Tile({
	source: new ol.source.OSM({wrapX: false})
})

var view = new ol.View({
	projection: 'EPSG:4326',
	center: [-95,37],
	zoom: 3
})

var map = new ol.Map({
	target: 'figure1',
	layers: [osm],
	view: view
})

var features = new ol.Collection()
var vectors = new ol.source.Vector({
	features: features,
	wrapX: false
})

var segments = new ol.layer.Vector({
	source: vectors
})

map.addLayer(segments)
d3.csv('mains/wildfires/data/usa.csv',

	// data filtering and preprocessing
	function(datum){
		if(datum.Flag == '0'){
			return {
				unixtime : new Date(
					Number(datum.Year),
					Number(datum.Month),
					Number(datum.Day)
				).getTime()/1000|0,
				latitude: Number(datum.Latitude),
				longitude: Number(datum.Longitude),
				acres: Number(datum.Acres)
			}
		}
	},

	// plot the data
	function(error,data) {
		if (error) throw error

		data.sort(function(first,second) {
			return first.unixtime-second.unixtime
		})

		delayedLoop(10,data.length,i => {
			var datum = data[i]

			var geometry = new ol.geom.Point([datum.longitude,datum.latitude])
			var feature = new ol.Feature({area: datum.acres, geometry: geometry})

			feature.setId(i)
			vectors.addFeature(feature)
		})
	}
)
