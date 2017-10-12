/* global d3 wildfireData:true */
/* exported wildfireData */

// data import
const acresToKm =  0.0040468599998211
wildfireData = new Promise( resolve => {
	d3.csv('mains/wildfires/data/usa.csv',

		// data filtering and preprocessing
		function(datum){

			if(datum.Flag == '0'){
				return {

					date : new Date(
						Number(datum.Year),
						Number(datum.Month),
						Number(datum.Day)),

					latitude: Number(datum.Latitude),
					longitude: Number(datum.Longitude),
					area: acresToKm*Number(datum.Acres)
				}
			}
		},

		// load data to global variable
		function(error,data) {
			if (error) throw error
			resolve(data)
		}
	)
})
