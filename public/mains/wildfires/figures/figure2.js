// [Fig.2] - Burnt acres cumulative and density distributions
/* global d3 */

// Set the dimensions of the canvas / graph
var svg = d3.select('svg'),
	margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = +svg.attr('width') - margin.left - margin.right,
	height = +svg.attr('height') - margin.top - margin.bottom,
	g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Set the ranges
var x = d3.scaleLinear().rangeRound([0,width])
var y = d3.scaleLog().rangeRound([height,0])

// Define the line
var line = d3.line()
	.x(function(datum) { return x(datum.date) })
	.y(function(datum) { return y(datum.acres) })

// Get the data
d3.csv('mains/wildfires/data/usa.csv',

	// data filtering and preprocessing
	function(datum){
		if(datum.Flag == '0'){
			return {
				date : new Date(
					Number(datum.Year),
					Number(datum.Month),
					Number(datum.Day)),
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
			return first.date-second.date
		})

		x.domain(d3.extent(data, function(d) { return d.date }))
		y.domain(d3.extent(data, function(d) { return d.acres }))

		g.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(x))
			.select('.domain')
			.remove()

		g.append('g')
			.call(d3.axisLeft(y))
			.append('text')
			.attr('fill', '#000')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '0.71em')
			.attr('text-anchor', 'end')
			.text('Price ($)')

		g.append('path')
			.datum(data)
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round')
			.attr('stroke-width', 1.5)
			.attr('d', line)

})
