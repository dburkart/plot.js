var token = require('../../lib/token');
var builtin = require('../../lib/builtin');
var SVG = require('../../lib/drawing/svg');

var canvas;

module.exports.setCanvas = function(c) {
	canvas = c;
}

var graph_x = function(f, parser) {
	var svg = new SVG(canvas.width, canvas.height);
	var function_prototype = parser.fnLookup[f];
	var upper_bound = canvas.x_scale;

	var step_size = canvas.x_scale / canvas.width;

	for (var i = 0; i < upper_bound; i += step_size) {
		var y = parser.callFunc({type: token.type.func, value: f, parameters: [i]}, parser.varTable);
		canvas.addPoint(i, y.value);
	}

	svg.addPolyline(canvas.convertPointsToSVGPolyline());

	return svg.render();
}

builtin.addFunction('graph_x', ['f'], graph_x);