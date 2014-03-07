var token = require('../lib/token');

var fnLookup = {};
var fnDefinitions = {};

var addFunction = function(name, params, fn) {
	fnLookup[name] = {type: token.type.func, value: name, parameters: params};
	fnDefinitions[name] = fn;
}

addFunction('sqrt', ['x'], Math.sqrt);
addFunction('abs', ['x'], Math.abs);
addFunction('round', ['x'], Math.round);

module.exports.fnLookup = fnLookup;
module.exports.fnDefinitions = fnDefinitions;
module.exports.addFunction = addFunction;