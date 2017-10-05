/*
Module that defines the particle.
2017. G. Szep
 */

/* global d3 nj $ */
import Poisson from './random/poisson.js'
var canvas = d3.select('#canvas').append('svg')
	.attr('width','100%').attr('height', '500')

// defining bindings
var rate = 1.0
$('#canvas').mousemove(function(mouse){
	rate = 20*Math.exp(- 0.01 * mouse.offsetX)
})

function Particle(position,velocity) {

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
		}
	)
}

Particle.prototype.diffuse = function() {
	var step = nj.random(2).multiply(2).subtract(1).multiply(rate)
	this.position.add(step,false)
	this.update()
}

Particle.prototype.update = function() {

	// update rates and time step here
	this.show()
}

Particle.prototype.show = function() {

	if ( this.draw == undefined ) {

		this.draw = canvas.append('circle')
		this.draw.attr('r',2.7).style('fill','green')
	}

	// update position
	this.draw.attr('cx',this.position.get(0))
	this.draw.attr('cy',this.position.get(1))
}

export { Particle as default }
