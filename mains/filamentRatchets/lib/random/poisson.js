/*
Module for generating poisson events.
2017. G. Szep
 */
const EventEmitter = require('events').EventEmitter,
	random = require("random-js")()

var Poisson = module.exports = function(rate, name, event) {

	// initialising objects, params
	this.generator = new EventEmitter()
	this.rate = rate
	this.event = event
	this.name = name

	// setting asyncronous event
	var parent = this
	this.generator.on(name, () => {
		setImmediate( () => {
			parent.event()
		})
	})

	// begin sampling poisson process
	this.start()
}

Poisson.prototype.start = function() {
	this.happening = true
	this.happen()
}

Poisson.prototype.happen = function() {
	if ( this.happening ){

		// sampling poisson interval
		this.interval = -Math.log( Math.random() ) / this.rate

		// delayed recursive timeout loop
		this.loop = setTimeout( () => {
			this.generator.emit(this.name)
			this.happen()

		}, this.interval )

		// interupt for sudden rate change
		//while ( this.something ){
		//	clearTimeout(this.loop)
		//	this.happen()
		//}
	} else {

		delete(this.generator)
	}
}

Poisson.prototype.stop = function() {
	this.happening = false
}
