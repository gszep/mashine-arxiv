/* global d3 */

// figure formatting object
function Figure (figureId,margin) {

	if (!margin)
		margin = {top: 20, right: 20, bottom: 30, left: 50}
	this.figure = d3.select(figureId)

	this.width = this.figure.attr('width')-margin.left-margin.right
	this.height = this.figure.attr('height')-margin.top-margin.bottom

	this.graph = this.figure.append('g').attr('transform',
		'translate({0},{1})'.format(margin.left,margin.top)
	)
}

// string formatting method
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined'
				? args[number]
				: match
		})
	}
}

export { Figure as default }
