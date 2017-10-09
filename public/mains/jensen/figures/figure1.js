// [Fig.1] - Graphical proof of Jensen's inequality
/* global d3 $ */

const margin = {top: 20, right: 20, bottom: 50, left: 50}
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined'
				? args[number]
				: match
		})
	}
}

function width(){
	return d3.select('svg').attr('width')-margin.left-margin.right
}
function height(){
	return +d3.select('svg').attr('height')-margin.top-margin.bottom
}

var figure = d3.select('svg')
	.append('g').attr('id','figure1').attr('transform',
		'translate({0},{1})'.format(margin.left,margin.top)
	)

function update(data) {
	// d3.select('svg').attr('width',width())
	// var g = d3.select('svg')
	// 	.append('g').attr('transform',
	// 		'translate('+margin.left+','+margin.top+')'
	// 	)

	// Set the ranges
	var x = d3.scaleLinear().rangeRound([0,width()])
	var y = d3.scaleLinear().rangeRound([height(),0])

	var line = d3.line()
		.x(function(datum) { return x(datum.x) })
		.y(function(datum) { return y(datum.y) })

	x.domain(d3.extent(data, function(datum) { return datum.x }))
	y.domain(d3.extent(data, function(datum) { return datum.y }))

	// updating values
	var path = figure.selectAll('path').data([data])

	// entering values
	path.enter().append('path')
		.attr('class','line')
	path.transition()
		.attr('fill', 'none')
		.attr('stroke', 'steelblue')
		.attr('d',line)

		// removing values
	path.exit().remove()

	figure.selectAll('g').remove()
	figure.append('g').call(d3.axisBottom(x))
		.attr('transform','translate(0,{0})'.format(height()))
	figure.append('g').call(d3.axisLeft(y))

	// DATA JOIN
	// Join new data with old elements, if any.
	// var text = figure.selectAll('text').data(data)

	// UPDATE
	// Update old elements as needed.
	// text.attr('class','update')

	// ENTER
	// Create new elements as needed.
	//
	// ENTER + UPDATE
	// After merging the entered elements with the update selection,
	// apply operations to both.
	// text.enter().append('text')
	// 	.attr('class', 'enter')
	// 	.attr('x', function(d, i) { return i * 32 })
	// 	.attr('dy', '.35em')
	// 	.merge(text)
	// 	.text(function(d) { return d })

	// EXIT
	// Remove old elements as needed.
	// text.exit().remove()
}

function pdf(x,mu,sigma){
	var normalisation = sigma*Math.sqrt(2*Math.PI)
	return Math.exp(-Math.pow((x-mu)/sigma,2)/2)/normalisation
}

function getData(mu,sigma){
	var data = []

	for (var xi = -3; xi <= 3; xi+=0.05 ){
		var yi = pdf(xi,mu,sigma)
		data.push({ x: xi, y: yi })
	}
	return data
}

// initial display.
var data = getData(0,1)
update(data)

// define interactions
$('#figure1').mousemove(function(mouse){
	var mu = 6*mouse.offsetX/width()-3
	var data = getData(mu,1)
	update(data)
})
