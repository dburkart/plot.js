var should = require('should');
var Parser = require('../../lib/interpreter/parser');
var Lexer = require('../../lib/interpreter/lexer');

describe('Testing builtin', function() {
    it('sqrt(16) is 4', function() {
        var parser = new Parser('sqrt(16)');
        parser.eval().should.equal(4);
    });

    it('abs(-4) is 4', function() {
        var parser = new Parser('abs(-4)');
        parser.eval().should.equal(4);
    });

    it('round(2.6) is 3', function() {
        var parser = new Parser('round(2.6)');
        parser.eval().should.equal(3);
    });
});
