var Lexer = require('../lib/lexer');
var token = require('../lib/token');

var Parser = function(string) {
	this.input = string;
}

Parser.prototype.input = '';
Parser.prototype.varTable = {};

Parser.prototype.fnLookup = {};
Parser.prototype.fnDefinitions = {};

Parser.prototype.eval = function() {
	var statements = this.input.split('\n');
	var result = null;

	var varTable = this.varTable;
	var fnTable = this.fnTable;

	for (var i = 0; i < statements.length; i++) {
		result = this.evaluateStatement(statements[i], varTable);
	}

	return result;
}

Parser.prototype.evaluateStatement = function(statement, varTable) {
	var lexer = new Lexer(statement);
	var operators = [];
	var values = [];

	var tok = lexer.next();
	while (tok.type !== token.type.nil) {
		if (tok.type === token.type.unaryOp ||
			tok.type === token.type.binaryOp) {
			if (tok.value === ')') {
				var evaluation = this.evaluateStacks(operators, values, varTable);

				operators = evaluation[0];
				values = evaluation[1];
			} else {
				operators.push(tok);
			}
		} else if (tok.type === token.type.func) {
			var nextToken = lexer.next();

			if ( nextToken.type === token.type.binaryOp ) {
				this.fnLookup[tok.value] = tok;
				this.fnDefinitions[tok.value] = statement.slice(lexer.position);
				return true;
			} else {
				values.push(tok);
				tok = nextToken;
				continue;
			}
		} else {
			values.push(tok);
		}

		tok = lexer.next();
	}

	var evaluation = this.evaluateStacks(operators, values, varTable)
	var result = evaluation[1][0];

	if (result.type === token.type.numeric) {
		return result.value;
	} else if (result.type === token.type.variable) {
		return varTable[result.value];
	} else if (result.type === token.type.func) {
		return this.callFunc(result, varTable).value;
	}
}

Parser.prototype.evaluateStacks = function(operators, values, varTable) {
	while (operators.length > 0) {
		var op = operators.pop();
		var nextOp = operators[0];

		if (op.value === '(') {
			return [operators, values];
		}

		if (nextOp === undefined ||
			token.precedence(op.value) > token.precedence(nextOp.value)) {
			values.push(this.unaryOperation(op, values, varTable));
		} else {
			var rval = values.pop();
			var result = this.evaluateStacks(operators, values, varTable);

			operators = result[0];
			values = result[1];

			operators.push(op);
			values.push(rval);
		}
	}

	return [operators, values];
}

Parser.prototype.callFunc = function(func, varTable) {
	var newVarTable = this.cloneVariableSpace(varTable);
	var fnSignature = this.fnLookup[func.value];

	for (var i = 0; i < func.parameters.length; i++) {
		newVarTable[fnSignature.parameters[i]] = func.parameters[i];
	}

	return {
		type : token.type.numeric,
		value : this.evaluateStatement(
				this.fnDefinitions[func.value],
				newVarTable
			)
	};
}

Parser.prototype.unaryOperation = function(tok, stack, varTable) {
	var b = stack.pop();
	var a = stack.pop();

	if (b.type === token.type.variable) b = {
		type : token.type.numeric,
		value : varTable[b.value]
	};

	if (a.type === token.type.variable &&
		tok.type !== token.type.binaryOp) a = {
		type : token.type.numeric,
		value : varTable[a.value]
	};

	if (b.type === token.type.func) {
		b = this.callFunc(b, varTable);
	}

	if (a.type === token.type.func &&
		tok.type !== token.type.binaryOp) {
		a = this.callFunc(a, varTable);
	}

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
		case '^':
			var result = Math.pow(a.value, b.value);
			return {type: token.type.numeric, value: result};
		case '=':
			if (a.type === token.type.variable) varTable[a.value] = b.value;
			return b;
	}
}

Parser.prototype.cloneVariableSpace = function(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = this.cloneVariableSpace(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = this.cloneVariableSpace(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

module.exports = Parser;