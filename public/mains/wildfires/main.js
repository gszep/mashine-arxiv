/*
Main wildfire report
2017. G. Szep
 */

/* global ol d3 $ */

/////////////////////////////////////////////////////////////////////////
// dataviewer

var osm = new ol.layer.Tile({
	source: new ol.source.OSM({wrapX: false})
})

var view = new ol.View({
	projection: 'EPSG:4326',
	center: [-95,37],
	zoom: 3
})

var map = new ol.Map({
	target: 'map',
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

/////////////////////////////////////////////////////////////////////////
// importing wildfire data

import csvJSON from './lib/csv.js'
var wildfires

$.get('mains/wildfires/usa.csv', function(fileString) {

	wildfires = csvJSON(fileString)
	wildfires.splice(-1,1)

	var acres = []
	wildfires.forEach( function(fire){
		acres.push(Number(fire.Acres))
	})
	acres.sort()

	/////////////////////////////////////////////////////////////////////////
	// display spatially

	var nFires = wildfires.length-1
	var delay = 25;

	( function delayedLoop (i) {
		setTimeout( () => {
			var fire = wildfires[i]

			var geometry = new ol.geom.Point([fire.Longitude,fire.Latitude])
			var feature = new ol.Feature({ area: Number(fire.Acres), geometry: geometry })

			feature.setId(i)
			vectors.addFeature(feature)

			if (0 < i) delayedLoop(i-1)
		}, delay)
	})(nFires)


	/////////////////////////////////////////////////////////////////////////


	var data = acres
	var formatCount = d3.format(',.0f')

	var svg = d3.select('svg'),
		margin = {top: 10, right: 30, bottom: 30, left: 30},
		width = +svg.attr('width') - margin.left - margin.right,
		height = +svg.attr('height') - margin.top - margin.bottom,
		g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	var x = d3.scaleLinear(0,10000).rangeRound([0, width])
	var bins = d3.histogram().domain(x.domain()).thresholds(x.ticks(20))(data)

	var y = d3.scaleLinear().domain([0, d3.max(bins, function(d) { return d.length})]).range([height, 0])

	var bar = g.selectAll('.bar').data(bins).enter().append('g').attr('class', 'bar').attr('transform', function(d) { return 'translate(' + x(d.x0) + ',' + y(d.length) + ')' })

	bar.append('rect')
		.attr('x', 1)
		.attr('width', x(bins[0].x1) - x(bins[0].x0) - 1)
		.attr('height', function(d) { return height - y(d.length) })

	bar.append('text')
		.attr('dy', '.75em')
		.attr('y', 6)
		.attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
		.attr('text-anchor', 'middle')
		.text(function(d) { return formatCount(d.length) })

	g.append('g')
		.attr('class', 'axis axis--x')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x))
})
