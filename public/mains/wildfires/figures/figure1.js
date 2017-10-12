// [Fig.1] - Spatial distribution of wildfires in the USA
/* global ol wildfireData */
import delayedLoop from '../lib/loop.js'

var osm = new ol.layer.Tile({
	source: new ol.source.Stamen({
		layer: 'terrain',
		wrapX: false
	})
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
	source: vectors,
	style: function(){
		return new ol.style.Style({
			fill: new ol.style.Fill({
				color: [150,0,0,0.5]
			}),
			stroke: new ol.style.Stroke({
				color: [150,0,0,0.5],
				width: 2
			})
		})
	}
})

map.addLayer(segments)
wildfireData.then( data => {

	data.sort(function(first,second) {
		return first.date-second.date
	})

	delayedLoop(10,data.length,i => {
		var datum = data[i]

		var geometry = new ol.geom.Circle(
			[datum.longitude,datum.latitude],
			Math.sqrt(datum.area)/100
		)
		var feature = new ol.Feature({area: datum.area, geometry: geometry})

		feature.setId(i)
		vectors.addFeature(feature)
	})
})
