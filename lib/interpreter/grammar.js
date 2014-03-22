// grammar.js will take a list of tokens, and classify it as one of the
// possible plot.js language constructs

var token = require('../../lib/interpreter/token');

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var constructs = {
	var_list: 100,
	statement_list: 101,
	statement: 102,
	function_def: 103,
	function_call: 104,
};

var make_construct = function(type, tokens, pos) {
	return {type: type, tokens: tokens, reference_pos: pos};
}

exports.type = constructs;

var var_list = function(token_list) {
	for (var i = 0; i < token_list.length; i++) {
		var tok = token_list[i];

		if (i % 2 === 0) {
			if (tok.type !== token.type.numeric &&
				tok.type !== token.type.variable) {
				if (i === 0) return false;
				return make_construct(constructs.var_list, token_list.slice(0, i), i);
			}
		} else {
			if (tok.type !== token.type.unaryOp ||
				tok.value !== ',') {
				if (i === 0) return false;
				return make_construct(constructs.var_list, token_list.slice(0, i), i);
			}
		}
	}

	return make_construct(constructs.var_list, token_list, i);
}

exports.var_list = var_list;

var statement_list = function(token_list) {
	var last_comma = 0;
	var stmt_list = [];
	for (var i = 0; i < token_list.length; i++) {
		var tok = token_list[i];

		if (tok.value === ',') {
			var construct = statement(token_list.slice(last_comma, i));
			if (!construct) return false;
			last_comma = i + 1;
			stmt_list.push(construct);
		}
	}

	var construct = statement(token_list.slice(last_comma, token_list.length));
	if (!construct) return false;
	stmt_list.push(construct);

	return make_construct(constructs.statement_list, stmt_list, token_list.length);
}

exports.statement_list = statement_list;

var statement = function(token_list) {
	if (token_list.length === 0) return make_construct(constructs.statement, [token.type.nil], 0);

	if (token_list.length === 1) {
		if (token_list[0].type === token.type.variable ||
			token_list[0].type === token.type.numeric) {
			return make_construct(constructs.statement, token_list, token_list.length + 1);
		}
	} else {
		var construct = function_call(token_list);

		if (construct) {
			var operator = token_list[construct.reference_pos];
			var right_hand = token_list.slice(construct.reference_pos + 1);

			if (operator === undefined || operator.type !== token.type.unaryOp) {
				return make_construct(constructs.statement, [construct], construct.reference_pos);
			} else if (right_hand === undefined) {
				return false;
			} else {
				var stmt = statement(right_hand);

				if (!stmt) return false;

				stmt.tokens.unshift(operator);
				stmt.tokens.unshift(construct);
				stmt.reference_pos += construct.reference_pos + 1;

				return stmt;
			}
		} else {
			var left_hand = token_list[0];
			var operator = token_list[1];
			var right_hand = token_list.slice(2);

			if (left_hand.value === '(' ||
				operator.value === ')') {
				right_hand.unshift(operator);

				construct = statement(right_hand);

				if (!construct) return false;

				construct.tokens.unshift(left_hand);
				construct.reference_pos += 1;

				return construct;
			} else if (operator.type !== token.type.unaryOp &&
				operator.type !== token.type.binaryOp) {

				return make_construct(constructs.statement, [left_hand], 1);
			} else if (operator.value === ',' && right_hand[0].type === token.type.newline) {
				var nl = right_hand[0];
				right_hand.remove(0);

				construct = statement(right_hand);

				construct.tokens.unshift(nl);
				construct.tokens.unshift(left_hand);
				construct.reference_pos += 3;

				return construct;
			} else if (right_hand === undefined) {
				return false;
			} else {
				construct = statement(right_hand);

				if (!construct) return false;

				construct.tokens.unshift(operator);
				construct.tokens.unshift(left_hand);
				construct.reference_pos += 2;

				return construct;
			}
		}
	}
}

exports.statement = statement;

var function_def = function(token_list) {
	var tok = token_list[0];

	if (tok.type !== token.type.variable) return false;

	var first_paren, last_paren;

	if (token_list.length <= 3) return false;

	tok = token_list[1];

	if (tok.value !== '(') return false;

	first_paren = 1;

	for (var i = 0; i < token_list.length; i++) {
		if (token_list[i].value === ')') {
			last_paren = i;
			break;
		}
	}

	if (last_paren === undefined) return false;

	var tmp_construct = {reference_pos: first_paren + 1};
	while(tmp_construct.reference_pos < last_paren) {
		tmp_construct = var_list(token_list.slice(tmp_construct.reference_pos, last_paren));
		if (!tmp_construct) return false;
		tmp_construct.reference_pos += first_paren + 1;
	}

	if (last_paren + 1 >= token_list.length || token_list[last_paren + 1].value !== '=') return false;

	var definition = statement(token_list.slice(last_paren + 2, token_list.length));
	var construct = make_construct(constructs.function_def, token_list.slice(0, last_paren + 1), definition.reference_pos + last_paren + 2);
	construct.definition = definition;

	return construct;
}

exports.function_def = function_def;

var function_call = function(token_list) {
	var tok = token_list[0];

	if (token_list.length < 3) return false;
	if (tok.type !== token.type.variable) return false;

	var first_paren, last_paren;

	tok = token_list[1];

	if ( tok === undefined ) console.log(token_list);

	if (tok.value !== '(') return false;

	first_paren = 1;
	
	var open_parens = 1;
	for (var i = first_paren + 1; i < token_list.length; i++) {
		if (token_list[i].value === '(') {
			open_parens += 1;
		}

		if (token_list[i].value === ')') {
			open_parens -= 1;
		}

		if (open_parens === 0) {
			last_paren = i;
			break;
		}
	}

	if (last_paren === undefined) return false;

	var stmt_list = statement_list(token_list.slice(first_paren + 1, last_paren));
	if (!statement_list(token_list.slice(first_paren + 1, last_paren))) return false;

	if (last_paren < token_list.length - 1 && token_list[last_paren + 1].value === '=') return false;

	return make_construct(constructs.function_call, [token_list[0], stmt_list], last_paren + 1);
}

exports.function_call = function_call;

exports.classify = function(token_list) {
	var i = 0;
	var classification = [];

	while(i < token_list.length) {
		var c;
		var sub_list = token_list.slice(i);

		if (c = function_def(sub_list)) {
			classification.push(c);
		} else if (c = statement(sub_list)) {
			classification.push(c);
		}

		if (!c) {
			c = {reference_pos: 1};
		}

		i = i + c.reference_pos;

		if (i < token_list.length && token_list[i].type == token.type.newline) i++;
	}

	return classification;
}

