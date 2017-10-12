// [Fig.2] - Burnt area cumulative distribution
/* global d3 wildfireData */

// initialising figure
import Figure from '../lib/figure.js'
var figure = new Figure('#figure2')

// set axes frame
var x = d3.scaleLog().rangeRound([0,figure.width])
var y = d3.scaleLog().rangeRound([figure.height,0])

wildfireData.then( data => {

	data.sort(function(first,second) {
		return first.area-second.area
	})

	// define value domains
	x.domain(d3.extent(data,
		function(datum) {
			return datum.area
		}
	))

	y.domain(d3.extent(data,
		function(datum,i) {
			return (data.length-i)/data.length
		}
	))

	// scatter data
	figure.graph.selectAll('dot').data(data)
		.enter().append('circle')

		.attr('cx', function(datum){
			return x(datum.area)
		})

		.attr('cy', function(datum,i) {
			return y((data.length-i)/data.length)
		})

		.attr('r', 0.5).attr('stroke','red')

	// axes formatting
	figure.graph.append('g').call(d3.axisBottom(x))
		.attr('transform','translate(0,'+figure.height+')')

		.append('text').text('Burnt Acres, km')
		.attr('transform','translate(400,-10)')
		.attr('fill','black')

	figure.graph.append('g').call(d3.axisLeft(y))
		.attr('transform','translate(0,0)')

		.append('text').text('Survival Function')
		.attr('transform','rotate(-90) translate(-20,15)')
		.attr('fill','black')
})
