/*
Module for generating poisson events.
2017. G. Szep
 */
const EventEmitter = require('events').EventEmitter,
	setImmediate = require('timers').setImmediate,
	random = require("random-js")()

var Poisson = module.exports = function(rate, name, event) {

	// initialising objects, params
	this.emitter = new EventEmitter()
	this.event = event

	this.rate = rate
	this.name = name

	// setting asyncronous events and handle errors
	var parent = this
	this.emitter.on( this.name, () => {
		setImmediate( () => {
			parent.event()
		})
	})

	this.emitter.on('error', error => {
		console.error('[Poisson] Error ' + error )
	})

	// begin sampling poisson process
	this.start()
}

Poisson.prototype.start = function() {
	this.happening = true
	this.happen()
}

Poisson.prototype.stop = function() {
	this.happening = false
}

Poisson.prototype.happen = function() {
	if ( this.happening ){

		// sampling poisson interval
		this.interval = -Math.log( Math.random() ) / this.rate

		// delayed recursive timeout loop
		this.loop = setTimeout( () => {
			this.emitter.emit(this.name)
			this.happen()

		}, this.interval )

		// interupt for sudden rate change
		//while ( this.something ){
		//	clearTimeout(this.loop)
		//	this.happen()
		//}
	} else {
		delete(this.emitter)
	}
}
