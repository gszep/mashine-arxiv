// [Fig.3] - Burnt area density distribution
/* global d3 wildfireData */

// initialising figure
import Figure from '../lib/figure.js'
var figure = new Figure('#figure3')

// set axes frame
var x = d3.scaleLog().rangeRound([0,figure.width])
var y = d3.scaleLog().rangeRound([figure.height,0])

wildfireData.then( data => {

	[0.02].forEach( binStep => {
		var histogram = d3.histogram()

			.value(function(datum) {
				return datum.area
			})

			.thresholds(d3.range(-3,5,binStep).map(
				function(n) {
					return Math.pow(10.0,n)
				})
			)

		var bins = histogram(data)

		// define value domains
		x.domain(d3.extent(data,
			function(datum) {
				return datum.area
			}
		))

		y.domain(d3.extent(bins,
			function(bin) {
				return (bin.length+1)/(data.length*(bin.x1-bin.x0))
			}
		))

		// append the bar rectangles to the svg element
		figure.graph.selectAll('dot').data(bins)
			.enter().append('circle')

			.attr('cx', function(bin){
				if (bin.length!=0)
					return x((bin.x0+bin.x1)/2)
			})

			.attr('cy', function(bin){
				if (bin.length!=0)
					return y(bin.length/(data.length*(bin.x1-bin.x0)))
			})

			.attr('r', 1.0).attr('stroke','red')
	})

	// axes formatting
	figure.graph.append('g').call(d3.axisBottom(x))
		.attr('transform','translate(0,'+figure.height+')')

		.append('text').text('Burnt Acres, km')
		.attr('transform','translate(400,-10)')
		.attr('fill','black')

	figure.graph.append('g').call(d3.axisLeft(y))
		.attr('transform','translate(0,0)')

		.append('text').text('Probability Density Function')
		.attr('transform','rotate(-90) translate(-20,15)')
		.attr('fill','black')
})