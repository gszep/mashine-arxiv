/*
Module that defines the space.
2017. G. Szep
 */
var Cytoplasm = module.exports = function() {
	this.body = {}

}

Cytoplasm.prototype.add = function(element) {
	this.body[element.id] = element
}
