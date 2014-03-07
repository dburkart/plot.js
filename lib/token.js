var token = {
	nil: 0,
	numeric: 1,
	variable: 2,
	unaryOp: 3,
	binaryOp: 4,
	func: 5,
};

var operatorPrecedence = {
	'+' : 2,
	'-' : 2,
	'*' : 4,
	'/' : 4,
}

var tokenRegexes = [
	// token.nil
	/$^/,

	// token.numeric
	/^\-?[0-9\.]+$/,

	// token.variable
	/^[a-z]+$/i,

	// token.unaryOp
	/^\+|\-|\*|\/|\(|\)$/,

	// token.binaryOp
	/^=$/,
];

exports.type = token;

exports.make = function(string) {

	for (var i = 0; i < tokenRegexes.length; i++) {
		var matches = tokenRegexes[i].exec(string);

		if (matches !== null) {
			return i;
		}
	}

	return token.nil;
}

exports.precedence = function(value) {
	return operatorPrecedence[value];
}