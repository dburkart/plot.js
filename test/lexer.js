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

        it('next() called twice returns token of type token.type.nil', function() {
            var result = new Lexer(' ');
            result.next();
            result.next().type.should.eql(token.type.nil);
        })
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

    describe('with string of \'1  2\'', function() {
    	var input = '1  2';
    	it('next() returns token of type token.type.numeric', function() {
    		var result = new Lexer(input);
    		result.next().type.should.eql(token.type.numeric);
    	});

    	it('next() called twice returns token of type token.type.numeric', function() {
    		var result = new Lexer(input);
    		result.next();
    		result.next().type.should.eql(token.type.numeric);
    	});
    });

    describe('with string of \'1\t2\'', function() {
    	var input = '1\t2';
    	it('next() returns token of type token.type.numeric', function() {
    		var result = new Lexer(input);
    		result.next().type.should.eql(token.type.numeric);
    	});

    	it('next() called twice returns token of type token.type.numeric', function() {
    		var result = new Lexer(input);
    		result.next();
    		result.next().type.should.eql(token.type.numeric);
    	});
    });

    describe('with string of \'-5\'', function() {
        it('next() returns token of type token.type.numeric', function() {
            var result = new Lexer('-5');
            result.next().type.should.eql(token.type.numeric);
        });

        it('next() returns token of value -5', function() {
            var result = new Lexer('-5');
            result.next().value.should.eql(-5);
        });
    });

    describe('with string of \'+5\'', function() {
        it('next() returns token of type token.type.numeric', function() {
            var result = new Lexer('+5');
            result.next().type.should.eql(token.type.numeric);
        });

        it('next() returns token of value 5', function() {
            var result = new Lexer('+5');
            result.next().value.should.eql(5);
        });
    });

    describe('with string of \'()\'', function() {
        it('next() returns token of type token.type.unaryOp', function() {
            var result = new Lexer('()');
            result.next().type.should.eql(token.type.unaryOp);
        });

        it('next() returns token of value \'(\'', function() {
            var result = new Lexer('()');
            result.next().value.should.eql('(');
        });
    })

    describe('with function definition of \'f(x)\'', function() {
        it("returns token of type token.type.func'", function() {
            var result = new Lexer('f(x)');
            result.next().type.should.equal(token.type.func);
        });

        it("returns token of value 'f'", function() {
            var result = new Lexer('f(x)');
            result.next().value.should.equal('f');
        });

        it("returns token with parameter list [x]", function() {
            var result = new Lexer('f(x)');
            result.next().parameters.should.containDeep(['x']);
        });
    });

    describe('with function definition of \'foo(x,y,z)\'', function() {
        it("returns token of type token.type.func'", function() {
            var result = new Lexer('foo(x,y,z)');
            result.next().type.should.equal(token.type.func);
        });

        it("returns token of value 'foo'", function() {
            var result = new Lexer('foo(x,y,z)');
            result.next().value.should.equal('foo');
        });

        it("returns token with parameter list [x, y, z]", function() {
            var result = new Lexer('foo(x,y,z)');
            result.next().parameters.should.containDeep(['x', 'y', 'z']);
        });
    });

    describe('with function call of \'foo(56)\'', function() {
        it("returns token of type token.type.func'", function() {
            var result = new Lexer('foo(56)');
            result.next().type.should.equal(token.type.func);
        });

        it("returns token of value 'foo'", function() {
            var result = new Lexer('foo(56)');
            result.next().value.should.equal('foo');
        });

        it("returns token with parameter list [56]", function() {
            var result = new Lexer('foo(56)');
            result.next().parameters.should.containDeep([56]);
        });
    });

    describe('with function call of \'foo()\'', function() {
        it("returns token of type token.type.func'", function() {
            var result = new Lexer('foo()');
            result.next().type.should.equal(token.type.func);
        });

        it("returns token of value 'foo'", function() {
            var result = new Lexer('foo()');
            result.next().value.should.equal('foo');
        });

        it("returns token with parameter list []", function() {
            var result = new Lexer('foo()');
            result.next().parameters.should.containDeep([]);
        });
    });
});