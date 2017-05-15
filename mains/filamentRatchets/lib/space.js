/*
Module that defines the space.
2017. G. Szep
 */
const random = require('random-js')(),
	nj = require('numjs')

var Space = module.exports = function() {

	this.particles = {}
	this.partitions = {}
	this.centroids = {}

	this.metric = 'euclidian'
	this.dimensions = 2
	this.partition_limit = 100
}

Space.prototype.add_particle = function(particle) {

	// add particle to space with unique identifyer
	var particle_id = random.uuid4().split('-')[4]
	this.particles[particle_id] = particle

	// create partition if there are none
	if ( Object.keys(this.partitions).length == 0 ){
		var parition_id = random.uuid4().split('-')[0]
		particle.draw.style("fill",intToRGB(hashCode(parition_id)))

		this.partitions[parition_id] = [particle_id]
		this.centroids[parition_id] = particle.position

	} else { // otherwise add to closest partition
		var parition_id = this.get_partition(particle)
		particle.draw.style("fill",intToRGB(hashCode(parition_id)))

		this.partitions[parition_id].push( particle_id )
		this.update_centroids()
	}
}

Space.prototype.get_centroid = function(partition) {

	var centroid = nj.zeros(this.dimensions),
		partition_size = partition.length,
		parent = this

	// calculate partition centroid
	partition.forEach( function(particle_id) {
		var position = parent.particles[particle_id].position
		centroid.add(position)
	})

	centroid.divide(partition_size)
	return centroid
}

Space.prototype.get_partition = function(particle) {

	var shortest_distance = Infinity,
		closest_partition

	for ( var parition_id in this.partitions ){
		var centroid = this.centroids[parition_id]

		// manhattan distance from particle to centroid
		var distance = nj.sum(nj.abs( centroid.subtract( particle.position ) ))

		// select partition with minimum centroid distance
		if( distance <= shortest_distance ){

			shortest_distance = distance
			closest_partition = parition_id
		}
	}
	return closest_partition
}

Space.prototype.update_centroids = function() {

	// update partition centroids
	for ( var parition_id in this.partitions ){

		var partition = this.partitions[parition_id]
		this.centroids[parition_id] = this.get_centroid(partition)
	}
}

Space.prototype.update_partitions = function() {
	var parent = this

	for ( var parition_id in this.partitions ){
		var partition = this.partitions[parition_id]

		if ( partition.length > this.partition_limit ){

			var parition_id = random.uuid4().split('-')[0],
				particle_id = partition[0]
				particle = this.particles[particle_id]

			particle.draw.style("fill",intToRGB(hashCode(parition_id)))
			this.partitions[parition_id] = [particle_id]
			this.centroids[parition_id] = particle.position


		} else {

			partition.forEach( function(particle_id) {
				var particle = parent.particles[particle_id]

				// check whether particle moved between partitions
				var current_partition = parent.get_partition(particle)
				if ( parition_id != current_partition ){

					var index = parent.partitions[parition_id].indexOf(particle_id)
					parent.partitions[parition_id].splice(index,1)

					parent.partitions[current_partition].push(particle_id)
					particle.draw.style("fill",intToRGB(hashCode(current_partition)))
				}
			})
		}
	}
}

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}
