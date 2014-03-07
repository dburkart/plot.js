var token = require('../lib/token');

var Lexer = function(string) {
	this.input = string;
}

Lexer.prototype.input = '';
Lexer.prototype.position = 0;
Lexer.prototype.previousToken = null;

Lexer.prototype.next = function() {
	var done = false;
	var val = '';
	var firstType = null;

	var tok = { type: token.type.nil, value: null };

	while (!done && this.position < this.input.length) {
		var c = this.input[this.position];

		// Whitespace ends a token
		if (c === ' ' ||
			c === '\t') {
			if (val !== '') done = true;
		} else {
			var charType = token.make(c);

			if (firstType === null) {
				val += c;
				firstType = charType;
			} else {
				if (firstType === charType) {
					val += c;
				} else if (token.validAsPrefix(val)) {
					val += c;
					firstType = token.make(val);
				} else {
					break;
				}
			}
		}	

		this.position++;
	}

	tok.type = token.make(val);

	// Convert to integer if token.type.numeric
	if (tok.type === token.type.numeric) {
		val = +val;
	}

	tok.value = val;
	
	// Set our look behind token
	this.previousToken = tok;

	return tok;
}

module.exports = Lexer;