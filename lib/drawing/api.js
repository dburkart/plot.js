var token = require('../../lib/interpreter/token');
var builtin = require('../../lib/interpreter/builtin');
var SVG = require('../../lib/drawing/svg');

var canvas;

module.exports.setCanvas = function(c) {
	canvas = c;
}

// Graph a function over the X-axis
//
// Returns an SVG
var plot_x = function(f, min, max, parser) {
	var svg = new SVG(canvas.width, canvas.height);
	var function_prototype = parser.fnLookup[f];
	var upper_bound = max;

	canvas.graph.setBoundsX(min, max);

	var step_size = canvas.graph.sizeX() / canvas.width;

	for (var i = min; i < upper_bound; i += step_size) {
		var y = parser.callFunction(f, [{type: token.type.numeric, value: i}], parser.varTable);

		canvas.addPoint(i, y.value);
	}

	var axes = canvas.axes();
	svg.addAxes(axes[0], axes[1]);
	svg.addPolyline(canvas.convertPointsToSVGPolyline());

	return svg.render();
}

builtin.addFunction('plot_x', ['f', 'min', 'max'], plot_x);

var plot_y = function(f, min, max, parser) {
	var svg = new SVG(canvas.width, canvas.height);
	var function_prototype = parser.fnLookup[f];
	var upper_bound = max;

	canvas.graph.setBoundsY(min, max);

	var step_size = canvas.graph.sizeY() / canvas.width;

	for (var i = min; i < upper_bound; i += step_size) {
		var x = parser.callFunction(f, [{type: token.type.numeric, value: i}], parser.varTable);

		canvas.addPoint(x.value, i);
	}

	var axes = canvas.axes();
	svg.addAxes(axes[0], axes[1]);
	svg.addPolyline(canvas.convertPointsToSVGPolyline());

	return svg.render();
}

builtin.addFunction('plot_y', ['f', 'min', 'max'], plot_y);

var canvas_size = function(width, height) {
	canvas.width = width;
	canvas.height = height;
}

builtin.addFunction('canvas_size', ['width', 'height'], canvas_size);