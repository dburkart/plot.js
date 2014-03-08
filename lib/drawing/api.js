var token = require('../../lib/token');
var builtin = require('../../lib/builtin');
var SVG = require('../../lib/drawing/svg');

var canvas;

module.exports.setCanvas = function(c) {
	canvas = c;
}

// Graph a function over the X-axis
//
// Returns an SVG
var graph_x = function(f, min, max, parser) {
	var svg = new SVG(canvas.width, canvas.height);
	var function_prototype = parser.fnLookup[f];
	var upper_bound = max;

	canvas.graph.setBoundsX(min, max);
	canvas.graph.setBoundsY(-1, 1);

	var step_size = canvas.graph.sizeX() / canvas.width;

	for (var i = min; i < upper_bound; i += step_size) {
		var y = parser.callFunc(
			{
				type: token.type.func, 
				value: f, 
				parameters: [{type: token.type.numeric, value: i}]
			}, 
			parser.varTable
		);

		canvas.addPoint(i, y.value);
	}

	var axes = canvas.axes();
	
	svg.addAxes(axes[0], axes[1]);
	svg.addPolyline(canvas.convertPointsToSVGPolyline());

	return svg.render();
}

builtin.addFunction('graph_x', ['f', 'min', 'max'], graph_x);