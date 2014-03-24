var token = require('../../lib/interpreter/token');

var Lexer = function(string) {
	this.input = string;
}

Lexer.prototype.input = '';
Lexer.prototype.position = 0;
Lexer.prototype.relativePosition = 0;
Lexer.prototype.previousToken = null;
Lexer.prototype.newlines = 1;

Lexer.prototype.next = function() {
	var done = false;
	var val = '';
	var firstType = null;

	var tok = { type: token.type.nil, value: null };

	try {
		while (!done && this.position < this.input.length) {
			var c = this.input[this.position];

			this.relativePosition++;

			// Whitespace ends a token
			if (c === '\n') {
				if (val !== '') break;
				done = true;
				val = '\n';
			} else if (c === ' ' ||
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
					} else if (token.validAsPrefix(val) &&
						(this.previousToken === null || this.previousToken.type === token.type.unaryOp)) {
						val += c;
						firstType = token.make(val);
					} else {
						break;
					}
				}
			}	

			if (c === '\n') {
				this.newlines++;
				this.relativePosition = 0;
			}

			this.position++;
		}

		tok.type = token.make(val);

		// Convert to integer if token.type.numeric
		if (tok.type === token.type.numeric) {
			val = +val;
		}

		tok.value = val;

		this.previousToken = tok;
	} catch (err) {
		throw( err + " on line " + this.newlines + ", character " + this.relativePosition);
	}

	return tok;
}

module.exports = Lexer;