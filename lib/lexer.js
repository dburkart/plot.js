var token = require('../lib/token');

var Lexer = function(string) {
	this.input = string;
}

Lexer.prototype.input = '';
Lexer.prototype.position = 0;

Lexer.prototype.next = function() {
	var done = false;
	var val = '';
	var tok = { type: token.type.nil, value: null };

	while (!done) {
		if (this.input[this.position] === ' ') {
			done = true;
		} else {
			val += this.input[this.position];
		}

		this.position++;
	}

	tok.type = token.make(val);

	// Convert to integer if token.type.numeric
	if (tok.type === token.type.numeric) {
		val = +val;
	}

	tok.value = val;

	return tok;
}

module.exports = Lexer;