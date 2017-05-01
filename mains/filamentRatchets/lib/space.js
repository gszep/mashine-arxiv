/*
Module that defines the space.
2017. G. Szep
 */
 
var Space = module.exports = function() {
	this.partitions = {}
	this.centroids = {}
}

Space.prototype.partition = function( num_partitions ) {


}

Space.prototype.add = function(particle) {

	if ( this.partitions.length == 0 ){

		// create parition
		this.partitions.push([ particle ])

	} else {

		var minimum = Infinity,
			selected = 0

		for ( var i = 0; i < centroids.length; i++ ){
			var centroid = this.centroids[i]

			// manhattan distance to centroid
			var distance = nj.sum(nj.abs( centroid.subtract( particle.position ) ))
			if( distance <= minimum ){

				// select partition with minimum centroid distance
				minimum = distance
				selected = i
			}
		}

		// add particle to selected partition
		this.partitions[selected].push( particle )
	}
}

Space.prototype.update = function() {

	for ( var i = 0; i < centroids.length; i++ ){

		this.centroids[i] = nj.mean( this.partitions[i] )

		// manhattan distance to centroid
		var distance =
		if( distance <= minimum ){

			// select partition with minimum centroid distance
			minimum = distance
			selected = i
		}
	}
}
