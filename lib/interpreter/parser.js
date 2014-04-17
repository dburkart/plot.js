var Lexer = require('../../lib/interpreter/lexer');
var token = require('../../lib/interpreter/token');
var grammar = require('../../lib/interpreter/grammar');
var builtin = require('../../lib/interpreter/builtin');

var Parser = function(string) {
	this.input = string;
	this.varTable = {};
	this.fnLookup = this.cloneVariableSpace(builtin.fnLookup);
	this.fnDefinitions = this.cloneVariableSpace(builtin.fnDefinitions);
}

Parser.prototype.input = '';
Parser.prototype.varTable = {};

Parser.prototype.fnLookup = builtin.fnLookup;
Parser.prototype.fnDefinitions = builtin.fnDefinitions;

Parser.prototype.eval = function() {
	var result = null;

	var varTable = this.varTable;
	var fnTable = this.fnTable;

	var lexer = new Lexer(this.input);
	var tokens = [];

    var tok = lexer.next();
    while (tok.type !== token.type.nil) {
        tokens.push(tok);
        tok = lexer.next();
    }

    var program = grammar.classify(tokens);

 	for (var i = 0; i < program.length; i++) {
 		result = this.evaluateStatement(program[i], varTable);
 	}

	return result;
}

Parser.prototype.evaluateStatement = function(statement, varTable) {
	var operators = [];
	var values = [];

	if (statement.type === grammar.type.function_def) {
		var fn_definition = {type: token.type.func, value: statement.tokens[0].value, parameters: []};

		for (var i = 2; i < statement.tokens.length - 1; i++) {
			var tok = statement.tokens[i];

			if (tok.value !== ',') {
				fn_definition.parameters.push(tok.value);
			}
		}

		this.fnLookup[fn_definition.value] = fn_definition;
		this.fnDefinitions[fn_definition.value] = statement.definition;
		return true;
	} else {
		for (var i = 0; i < statement.tokens.length; i++) {
			var tok = statement.tokens[i];

			if (tok.type === token.type.newline) {
				this.evaluateStacks(operators, values, varTable);
				return this.evaluateStatement({type: grammar.type.statement, tokens: statement.tokens.slice(i+1)}, varTable);
			} else if (tok.type === token.type.unaryOp ||
				tok.type === token.type.binaryOp) {
				if (tok.value === ')') {
					var evaluation = this.evaluateStacks(operators, values, varTable);

					operators = evaluation[0];
					values = evaluation[1];
				} else {
					operators.push(tok);
				}
			} else if (tok.type === grammar.type.function_call) {
				values.push(this.callFunc(tok, varTable));
			} else {
				values.push(tok);
			}
		}
	}

	var evaluation = this.evaluateStacks(operators, values, varTable);
	var result = evaluation[1][0];

	if (result.type === token.type.numeric) {
		return result.value;
	} else if (result.type === token.type.variable) {
		if (varTable[result.value] === undefined) {
			throw("Variable '" + result.value + "' has not been defined.");
		}

		return varTable[result.value];
	}
}

var highestPrecedence = function(op, stack) {
	var precedence = token.precedence(op.value);
	var highestIndex = -1;
	var i = 0;

	while (i < stack.length) {
		if (precedence <= token.precedence(stack[i].value)) highestIndex = i;
		i++;
	};

	return (highestIndex === -1);
}

Parser.prototype.evaluateStacks = function(operators, values, varTable) {
	while (operators.length > 0) {
		var op = operators.pop();
		var nextOp = operators[0];

		if (op.value === '(') {
			return [operators, values];
		}

		if (nextOp === undefined ||
			highestPrecedence(op, operators)) {
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

function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

// Friendly wrapper around callFunc
Parser.prototype.callFunction = function(function_name, parameters, varTable) {
	var function_block = {
		type: grammar.type.function_call,
		tokens: [
			{ 
				type: token.type.func, 
				value: function_name 
			},
			{ 
				type: grammar.type.statement_list, 
				tokens: parameters
			}
		]
	}

	return this.callFunc(function_block, varTable);
}

Parser.prototype.callFunc = function(func, varTable) {
	var newVarTable = this.cloneVariableSpace(varTable);
	var fnName = func.tokens[0].value;
	var fnSignature = this.fnLookup[fnName];

	if (fnSignature === undefined) {
		throw("Function '" + fnName + "' has not been defined.");
	}

	var parameters = func.tokens[1].tokens;
	for (var i = 0; i < parameters.length; i++) {
		var param = parameters[i];
		var varName = fnSignature.parameters[i];

		if (param === undefined) {
			console.log(this.fnDefinitions['f'].tokens[0].tokens);
		}

		if (param.type === grammar.type.statement && 
			param.tokens.length === 1 && 
			this.fnLookup[param.tokens[0].value] !== undefined) {
			newVarTable[varName] = parameters[i] = param.tokens[0].value;
		} else if (param.type === grammar.type.statement) {
			newVarTable[varName] = parameters[i] = this.evaluateStatement(param, varTable);
		} else {
			newVarTable[varName] = parameters[i] = this.evaluateStatement({type: grammar.type.statement, tokens: [param]}, varTable);
		}
	}	

	var val = null;
	var functionToCall = this.fnDefinitions[fnName];

	if (isFunction(functionToCall)) {
		parameters.push(this);
		val = functionToCall.apply(null, parameters);
	} else {
		val = this.evaluateStatement(functionToCall, newVarTable);
	}

	return {
		type : token.type.numeric,
		value : val
	};
}

Parser.prototype.unaryOperation = function(tok, stack, varTable) {
	var b = stack.pop();
	var a = stack.pop();

	if (b.type === token.type.variable) {
		if (varTable[b.value] === undefined) {
			throw("Variable '" + b.value + "' has not been defined.");
		}

		b = {
			type : token.type.numeric,
			value : varTable[b.value]
		};
	}

	if (a.type === token.type.variable &&
		tok.type !== token.type.binaryOp) {
		if (varTable[a.value] === undefined) {
			throw("Variable '" + a.value + "' has not been defined.");
		}

		a = {
			type : token.type.numeric,
			value : varTable[a.value]
		};
	}

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
		case '%':
			var result = a.value % b.value;
			return {type: token.type.numeric, value: result};
		case '=':
			if (a.type === token.type.variable) varTable[a.value] = b.value;
			return b;
		case ',':
			if (b.type === token.type.newline) {
				return a;
			}
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