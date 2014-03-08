var Parser = require('../lib/parser');
var Canvas = require('../lib/drawing/canvas');
var drawingAPI = require('../lib/drawing/api');

module.exports = function() {
	this.canvas = new Canvas();

	this.render = function(code) {
		drawingAPI.setCanvas(this.canvas);
		var parser = new Parser(code);
		return parser.eval();
	}
}
