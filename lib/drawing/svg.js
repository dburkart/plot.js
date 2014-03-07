var util = require('util');

var SVG = function(width, height) {
	this.width  = width;
	this.height = height;
}

SVG.prototype.width = 0;
SVG.prototype.height = 0;
SVG.prototype.items = [];
SVG.prototype.defaultStyle = 'fill:none;stroke:black;stroke-width:3';

SVG.prototype.addPolyline = function(points, style) {
	if (style === undefined) {
		style = this.defaultStyle;
	}

	this.items.push(util.format('<polyline points="%s" style="%s" />', points, style));
}

SVG.prototype.render = function() {
	return util.format('<svg width="%d" height="%d">%s</svg>', this.width, this.height, this.items.join('\n'));
}

module.exports = SVG;