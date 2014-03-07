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
			c === '\t' ||
			(c === ',' && firstType === token.type.func)) {
			if (val !== '') done = true;
		} else {
			var charType = token.make(c);

			if (firstType === null) {
				val += c;
				firstType = charType;
			} else {
				if (firstType === charType &&
					firstType !== token.type.unaryOp) {
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

	// Look ahead to see if we're a function
	if (tok.type === token.type.variable) {
		var oldPos = this.position;
		var nextToken = this.next();
		var parameters = [];

		if (nextToken.value === '(') {
			while (nextToken.value !== ')') {
				if (nextToken.type === token.type.variable ||
					nextToken.type === token.type.numeric ||
					nextToken.type === token.type.func ) {
					parameters.push(nextToken);
				}

				nextToken = this.next();
			}

			tok.type = token.type.func;
			tok.parameters = parameters;
		} else {
			this.position = oldPos;
		}
	}
	this.previousToken = tok;

	return tok;
}

module.exports = Lexer;