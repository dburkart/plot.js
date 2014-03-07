var Lexer = require('../lib/lexer');
var token = require('../lib/token');

var Parser = function(string) {
	this.input = string;
}

Parser.prototype.input = '';
Parser.prototype.stack = [];

Parser.prototype.eval = function() {
	var lexer = new Lexer(this.input);

	var tok = lexer.next();
	while (tok.type !== token.type.nil) {
		if (tok.type === token.type.numeric) this.stack.push(tok);
		if (tok.type === token.type.unaryOp) this.unaryOperation(lexer, tok);

		tok = lexer.next();
	}

	var result = this.stack.pop();

	return result.value;
}

Parser.prototype.unaryOperation = function(lexer, tok) {
	var a = this.stack.pop();
	var b = lexer.next();

	switch (tok.value) {
		case '+':
			var result = a.value + b.value;
			this.stack.push({type: token.type.numeric, value: result});
			break;
		case '-':
			var result = a.value - b.value;
			this.stack.push({type: token.type.numeric, value: result});
			break;
		case '*':
			var result = a.value * b.value;
			this.stack.push({type: token.type.numeric, value: result});
			break;
		case '/':
			var result = a.value / b.value;
			this.stack.push({type: token.type.numeric, value: result});
			break;
	}
}

module.exports = Parser;