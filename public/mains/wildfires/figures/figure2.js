// [Fig.2] - Burnt area cumulative and density distributions
/* global d3 */

// Set the dimensions of the canvas / graph
var svg = d3.select('#figure2'),
	margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = +svg.attr('width') - margin.left - margin.right,
	height = +svg.attr('height') - margin.top - margin.bottom,
	g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Get the data
const acresToKm =  0.0040468599998211
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
				area: acresToKm*Number(datum.Acres)
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

		x.domain(d3.extent(data, function(datum,i) { i; return datum.area }))
		y.domain(d3.extent(data, function(datum,i) { return (nData-i)/nData }))

		// scatter data
		g.selectAll('dot').data(data)
			.enter().append('circle')
			.attr('r', 0.5).attr('stroke','red')
			.attr('cx', function(datum,i) { i; return x(datum.area) })
			.attr('cy', function(datum,i) { return y((nData-i)/nData) })

		// axes formatting
		g.append('g').call(d3.axisBottom(x))
			.attr('transform','translate(0,'+height+')')

			.append('text').text('Burnt Acres, km')
			.attr('transform','translate(400,-10)')
			.attr('fill','black')

		g.append('g').call(d3.axisLeft(y))
			.attr('transform','translate(0,0)')

			.append('text').text('Survival Function')
			.attr('transform','rotate(-90) translate(-20,15)')
			.attr('fill','black')
	}
)
