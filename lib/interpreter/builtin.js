var token = require('../../lib/interpreter/token');

var fnLookup = {};
var fnDefinitions = {};

var addFunction = function(name, params, fn) {
    fnLookup[name] = {type: token.type.func, value: name, parameters: params};
    fnDefinitions[name] = fn;
};

addFunction('sqrt', ['x'], Math.sqrt);
addFunction('abs', ['x'], Math.abs);
addFunction('round', ['x'], Math.round);
addFunction('sin', ['x'], Math.sin);
addFunction('cos', ['x'], Math.cos);
addFunction('tan', ['x'], Math.tan);
addFunction('log', ['x'], Math.log);

module.exports.fnLookup = fnLookup;
module.exports.fnDefinitions = fnDefinitions;
module.exports.addFunction = addFunction;
