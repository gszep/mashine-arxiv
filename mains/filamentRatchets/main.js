/*
Main asyncronous monte carlo simulation of filament ratchets.
2017. G. Szep
 */

// importing libraries
const Poisson = require('./lib/random/poisson'),
	Particle = require('./lib/particle'),
	Space = require('./lib/space')

// initialising simulation canvas
var d3 = require('d3')
var nj = require('numjs')

canvas = d3.select("#canvas").append("svg").attr("width", "100%").attr("height", "500")

// defining bindings
rate = 1.0
$('#canvas').mousemove(function(mouse){
	rate = 20*Math.exp(- 0.01 * mouse.offsetX)
})

// simulation
var x = nj.array([250.0,250.0]),
	v = nj.array([0.0,0.0])

var space = new Space()
for (var i = 0; i < 500; i++ ){
	space.add_particle( new Particle(x,v) )
}
//space.update_partitions()

var happen = function() {

	// delayed recursive timeout loop
	this.loop = setTimeout( () => {

		space.update_centroids()
		space.update_partitions()
		console.log(space.centroids)
		happen()

	}, 3000 )
}

happen()
