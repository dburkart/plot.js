var should = require('should');
var Lexer = require('../../lib/interpreter/lexer');
var token = require('../../lib/interpreter/token');

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

    describe('with string of \'1+2\'', function() {
        var input = '1+2';
        it('returns an object with input of \'1+2\'', function() {
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

    describe('with string of \'1 , 2\'', function() {
        var input = '1 , 2';
        it('next() returns token of type token.type.numeric', function() {
            var result = new Lexer(input);
            result.next().type.should.eql(token.type.numeric);
        });

        it('next() called twice returns token of type token.type.unaryOp', function() {
            var result = new Lexer(input);
            result.next();
            result.next().type.should.eql(token.type.unaryOp);
        });

        it('next() called thrice returns token of type token.type.numeric', function() {
            var result = new Lexer(input);
            result.next();
            result.next();
            result.next().type.should.eql(token.type.numeric);
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
    });

    describe('with string of \'(-\'', function() {
        it('next() returns token of type token.type.unaryOp', function() {
            var result = new Lexer('(-');
            result.next().type.should.eql(token.type.unaryOp);
        });

        it('next() returns token of value \'(\'', function() {
            var result = new Lexer('(-');
            result.next().value.should.eql('(');
        });
    })
});