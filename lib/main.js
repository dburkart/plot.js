/* jshint evil: true */

var Parser = require('../lib/interpreter/parser');
var Canvas = require('../lib/drawing/canvas');
var drawingAPI = require('../lib/drawing/api');

module.exports = function() {
	this.canvas = new Canvas();

	this.render = function(code) {
		drawingAPI.setCanvas(this.canvas);
		var parser = new Parser(code);

		try {
			return parser.eval();
		} catch (err) {
			return "Error: " + err;
		}
	};
};
