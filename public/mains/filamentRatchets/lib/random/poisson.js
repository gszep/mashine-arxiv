/*
Module for generating poisson events.
2017. G. Szep
 */

/*eslint no-console: ["error", { allow: ["error","trace"] }] */
// 	setImmediate = require('timers').setImmediate

import EventEmitter from './events.js'
function Poisson(rate, name, event) {

	// initialising objects, params
	this.emitter = new EventEmitter()
	this.event = event

	this.rate = rate
	this.name = name

	// setting asyncronous events and handle errors
	var parent = this
	this.emitter.on( this.name, () => {
		parent.event() // TODO(gszep) is this really async?
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

		// sampling poisson interval TODO(gszep) use 	proper random-js library
		this.interval = -Math.log( Math.random() ) / this.rate

		// delayed recursive timeout loop
		this.loop = setTimeout( () => {
			this.emitter.emit(this.name)
			this.happen()

		}, this.interval )

	} else {
		delete(this.emitter)
	}
}

export { Poisson as default }
