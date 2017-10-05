/*
Dresses an express application with views and static files
2017. G. Szep
 */

/*global require module __dirname*/
var express = require('express')
var App = module.exports = function() {

	// initialise express app
	this.app = express()
	this.initialise()
	this.getViews()

	// return dressed app
	return this.app
}

// serve static files and use templating system
App.prototype.initialise = function() {

	this.app.use(express.static(__dirname + '/public'))
	this.app.set('view engine', 'ejs')
}

// paths to views
App.prototype.getViews = function() {

	this.app.get('/', function(req, res) {
		res.render('index')
	})

	this.app.get('/filamentRatchets', function(req, res) {
		res.render('filamentRatchets/index')
	})

	this.app.get('/wildfires', function(req, res) {
		res.render('wildfires/index')
	})
}
