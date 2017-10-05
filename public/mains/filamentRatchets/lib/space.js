/*
Module that defines the space.
2017. G. Szep
 */

/* global Random nj */
const random = new Random()

function Space() {

	this.particles = {}
	this.partitions = {}
	this.centroids = {}

	this.metric = 'euclidian'
	this.dimensions = 2

	this.upperBound = 500
	this.lowerBound = 100
}

Space.prototype.addParticle = function(particle) {

	// add particle to space with unique identifyer
	var particleId = random.uuid4().split('-')[4]
	this.particles[particleId] = particle

	// create partition if there are none
	if ( Object.keys(this.partitions).length == 0 ){

		var paritionId = random.uuid4().split('-')[0]
		particle.draw.style('fill',intToRGB(hashCode(paritionId)))

		this.partitions[paritionId] = [particleId]
		this.centroids[paritionId] = particle.position

	} else { // otherwise add to closest partition

		paritionId = this.getPartition(particle)
		particle.draw.style('fill',intToRGB(hashCode(paritionId)))
		this.partitions[paritionId].push( particleId )
	}
}

Space.prototype.getCentroid = function(partition) {

	var centroid = nj.zeros(this.dimensions),
		partitionSize = partition.length,
		parent = this

	// calculate partition centroid
	partition.forEach( function(particleId) {
		var position = parent.particles[particleId].position
		centroid.add(position,false)
	})

	centroid.divide(partitionSize,false)
	return centroid
}

Space.prototype.getPartition = function(particle) {

	var shortestDistance = Infinity,
		closestPartition

	for ( var paritionId in this.centroids ){
		var centroid = this.centroids[paritionId]

		// manhattan distance from particle to centroid
		var distance = nj.sum(nj.abs( centroid.subtract( particle.position ) ))

		// select partition with minimum centroid distance
		if( distance <= shortestDistance ){

			shortestDistance = distance
			closestPartition = paritionId
		}
	}
	return closestPartition
}

Space.prototype.updateCentroids = function() {

	// update partition centroids
	for ( var paritionId in this.partitions ){

		var partition = this.partitions[paritionId]
		this.centroids[paritionId] = this.getCentroid(partition)
	}
}

Space.prototype.updatePartitions = function() {
	for ( var paritionId in this.partitions ){

		var partition = this.partitions[paritionId],
			centroid = this.centroids[paritionId],
			parent = this

		// split partitions that exceed particle limit
		if ( this.upperBound < partition.length ){

			var newParition = random.uuid4().split('-')[0]
			this.centroids[newParition] = centroid.add(nj.random(2))
			this.partitions[newParition] = []

		}

		// reallocate particles
		partition.forEach( function(particleId) {
			var particle = parent.particles[particleId]

			// check whether particle moved between partitions
			var currentPartition = parent.getPartition(particle)
			if ( paritionId != currentPartition ){

				var index = parent.partitions[paritionId].indexOf(particleId)
				parent.partitions[paritionId].splice(index,1)

				parent.partitions[currentPartition].push(particleId)
				particle.draw.style('fill',intToRGB(hashCode(currentPartition)))
			}
		})


	}
}

function hashCode(str) {
	var hash = 0
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}
	return hash
}

function intToRGB(i){
	var c = (i & 0x00FFFFFF)
		.toString(16)
		.toUpperCase()

	return '00000'.substring(0, 6 - c.length) + c
}

export { Space as default }
