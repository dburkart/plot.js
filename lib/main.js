var Parser = require('../lib/parser');
var Canvas = require('../lib/drawing/canvas');

var Graphy = function() {
	// Do stuff
}

Graphy.prototype.canvas = new Canvas();

Graphy.prototype.render = function(code) {
	var parser = new Parser(code);
	return parser.eval();
}


module.exports = Graphy;
