var token = {
    nil: 0,
    func: 1,
    numeric: 2,
    variable: 3,
    unaryOp: 4,
    binaryOp: 5,
    newline: 6,
};

var operatorPrecedence = {
    '=' : 1,
    ',' : 2,
    '+' : 3,
    '-' : 3,
    '*' : 4,
    '/' : 4,
    '%' : 4,
    '^' : 6,
};

var tokenRegexes = [
    // token.nil
    /$^/,

    // token.func
    /$^/,

    // token.numeric
    /^[\-\+]?[0-9\.]+$/,

    // token.variable
    /^[a-z_]+$/i,

    // token.unaryOp
    /^\+|\-|\*|\/|\(|\)|\^|%|,$/,

    // token.binaryOp
    /^=$/,

    // token.newline
    /\n/,
];

exports.type = token;

exports.make = function(string) {

    for (var i = 0; i < tokenRegexes.length; i++) {
        var matches = tokenRegexes[i].exec(string);

        if (matches !== null) {
            return i;
        }
    }

    throw( "Unrecognized characters '" + string + "'" );
};

exports.precedence = function(value) {
    return operatorPrecedence[value];
};

exports.validAsPrefix = function(c) {
    if (c === '-' || c === '+') return true;

    return false;
};
