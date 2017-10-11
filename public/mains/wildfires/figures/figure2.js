// [Fig.2] - Burnt area cumulative and density distributions
/* global d3 */

// Set the dimensions of the canvas / graph
var svg = d3.select('svg'),
	margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = +svg.attr('width') - margin.left - margin.right,
	height = +svg.attr('height') - margin.top - margin.bottom,
	g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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
				area: 0.0040468599998211*Number(datum.Acres)
			}
		}
	},

	// plot the data
	function(error,data) {
		if (error) throw error

		var nData = data.length
		data.sort(function(first,second) {
			return first.area-second.area
		})

		// Set the ranges
		var x = d3.scaleLog().rangeRound([0,width])
		var y = d3.scaleLog().rangeRound([height,0])

		// Define the line
		var line = d3.line()
			.x(function(datum) { return x(datum.area) })
			.y(function(datum,i) { return y((nData-i)/nData) })

		x.domain(d3.extent(data, function(datum) { return datum.area }))
		y.domain(d3.extent(data, function(datum,i) { return (nData-i)/nData }))

		g.append('g')
			.attr('transform', 'translate(0,'+height+')')
			.call(d3.axisBottom(x))

		g.append('g')
			.call(d3.axisLeft(y))
			.append('text')
			.attr('fill', '#000')
			.attr('transform', 'rotate(-90) translate(-10,0)')
			.attr('y', 6)
			.attr('dy', '0.71em')
			.attr('text-anchor', 'end')
			.text('Survival Function')

		g.append('path')
			.datum(data)
			.attr('fill', 'none')
			.attr('stroke', 'red')
			.attr('stroke-width', 0.5)
			.attr('d',line)
	}
)
