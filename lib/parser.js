var Lexer = require('../lib/lexer');
var token = require('../lib/token');

var Parser = function(string) {
	this.input = string;
}

Parser.prototype.input = '';

Parser.prototype.eval = function() {
	var statements = this.input.split('\n');
	var result = null;

	for (var i = 0; i < statements.length; i++) {
		result = this.evaluateStatement(statements[i]);
	}

	return result;
}

Parser.prototype.evaluateStatement = function(statement) {
	var lexer = new Lexer(statement);
	var operators = [];
	var values = [];

	var tok = lexer.next();
	while (tok.type !== token.type.nil) {
		if (tok.type === token.type.numeric) values.push(tok);
		if (tok.type === token.type.unaryOp) {
			if (tok.value === ')') {
				var evaluation = this.evaluateStacks(operators, values);

				operators = evaluation[0];
				values = evaluation[1];
			} else {
				operators.push(tok);
			}
		}

		tok = lexer.next();
	}

	var evaluation = this.evaluateStacks(operators, values)
	var result = evaluation[1][0];

	return result.value;
}

Parser.prototype.evaluateStacks = function(operators, values) {
	while (operators.length > 0) {
		var op = operators.pop();
		var nextOp = operators[0];

		if (op.value === '(') {
			return [operators, values];
		}

		if (nextOp === undefined ||
			token.precedence(op.value) > token.precedence(nextOp.value)) {
			values.push(this.unaryOperation(op, values));
		} else {
			var rval = values.pop();
			var result = this.evaluateStacks(operators, values);

			operators = result[0];
			values = result[1];

			operators.push(op);
			values.push(rval);
		}
	}

	return [operators, values];
}

Parser.prototype.unaryOperation = function(tok, stack) {
	var b = stack.pop();
	var a = stack.pop();

	switch (tok.value) {
		case '+':
			var result = a.value + b.value;
			return {type: token.type.numeric, value: result};
		case '-':
			var result = a.value - b.value;
			return {type: token.type.numeric, value: result};
		case '*':
			var result = a.value * b.value;
			return {type: token.type.numeric, value: result};
		case '/':
			var result = a.value / b.value;
			return {type: token.type.numeric, value: result};
	}
}

module.exports = Parser;