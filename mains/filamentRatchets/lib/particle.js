/*
Module that defines the particle.
2017. G. Szep
 */
const random = require("random-js")(),
	nj = require("numjs")

const Poisson = require('./random/poisson')
var Particle = module.exports = function(position,velocity) {

	// state variables
	this.position = position.clone()
	this.velocity = velocity.clone()
	this.show()

	// possible events
	this.events = {}
	var parent = this

	this.events.elongate = new Poisson( 0.1,
		'diffuse', function(){
			parent.diffuse()
	})

	this.events.branch = new Poisson( 0.001,
		'branch', function(){
			parent.branch()
	})
}

Particle.prototype.diffuse = function() {
	var step = nj.random(2).multiply(2).subtract(1).multiply(rate)
	this.position.add(step,false)
	this.update()
}

Particle.prototype.branch = function() {
	new Particle(this.position,this.velocity)
}

Particle.prototype.update = function() {

	// update rates and time step here
	this.show()
}

Particle.prototype.show = function() {

	if ( this.line == undefined ) {

		this.line = canvas.append("circle")
		this.line.attr("r",2.7).style("fill","green")
	}

	// update position
	this.line.attr("cx",this.position.get(0))
	this.line.attr("cy",this.position.get(1))
}
