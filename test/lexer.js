var should = require('should');
var Lexer = require('../lib/lexer');
var token = require('../lib/token');

describe('lexer', function() {
    describe('with empty string', function() {
        it('returns an object with empty input', function() {
            var result = new Lexer(' ');
            result.input.should.eql(' ');
        });

        it('next() returns token of type token.type.nil', function() {
        	var result = new Lexer(' ');
        	result.next().type.should.eql(token.type.nil);
        });
    });

    describe('with string of \'1 + 2\'', function() {
    	var input = '1 + 2';
    	it('returns an object with input of \'1 + 2\'', function() {
    		var result = new Lexer(input);
    		result.input.should.eql(input);
    	});

    	it('next() returns token of type token.type.numeric', function() {
    		var result = new Lexer(input);
    		result.next().type.should.eql(token.type.numeric);
    	});

    	it('next() returns token of value 1', function() {
    		var result = new Lexer(input);
    		result.next().value.should.eql(1);
    	});

    	it('next() called twice returns token of type token.type.unaryOp', function() {
    		var result = new Lexer(input);
    		result.next();
    		result.next().type.should.eql(token.type.unaryOp);
    	});

    	it('next() called twice returns token of value +', function() {
    		var result = new Lexer(input);
    		result.next();
    		result.next().value.should.eql('+');
    	});
    });
});