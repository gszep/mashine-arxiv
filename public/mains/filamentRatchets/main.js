/*
Main asyncronous monte carlo simulation of filament ratchets.
2017. G. Szep
 */

/* global nj */

// importing libraries
import Particle from './lib/particle.js'
import Space from './lib/space.js'

// simulation
var space = new Space()
for (var i = 0; i < 1000; i++ ){
	var x = nj.array([500.0*Math.random(),500.0*Math.random()]),
		v = nj.array([0.0,0.0])

	space.addParticle( new Particle(x,v) )
}

function happen() {

	// delayed recursive timeout loop
	setTimeout( () => {

		space.updateCentroids()
		space.updatePartitions()

		happen()

	}, 3 )
}

happen()
