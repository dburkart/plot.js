var should = require('should');
var token = require('../lib/token');

// describe('lexer', function() {
//     describe('with empty string', function() {
//         it('returns an object with empty input', function() {
//             var result = new Lexer('');
//             result.input.should.eql('');
//         });
//     });

//     describe('with string of \'1 + 2\'', function() {
//     	var input = '1 + 2';
//     	it('returns an object with input of \'1 + 2\'', function() {
//     		var result = new Lexer(input);
//     		result.input.should.eql(input);
//     	})
//     })
// });

describe('token.make', function() {
    describe('with empty string', function() {
        it('returns token.type.nil', function() {
            var result = token.make('');
            result.should.eql(token.type.nil);
        });
    });

    describe('with numeric', function() {
        it('1 returns token.type.numeric', function() {
            var result = token.make('1');
            result.should.eql(token.type.numeric);
        });
        it('12 returns token.type.numeric', function() {
            var result = token.make('12');
            result.should.eql(token.type.numeric);
        });
        it('953250342132 returns token.type.numeric', function() {
            var result = token.make('953250342132');
            result.should.eql(token.type.numeric);
        });
    });

    describe('with variable', function() {
        it('x returns token.type.variable', function() {
            var result = token.make('x');
            result.should.eql(token.type.variable);
        });
        it('foo returns token.type.variable', function() {
            var result = token.make('foo');
            result.should.eql(token.type.variable);
        });
    });

    describe('with unary operator', function() {
        it('+ returns token.type.unaryOp', function() {
            var result = token.make('+');
            result.should.eql(token.type.unaryOp);
        });
        it('- returns token.type.unaryOp', function() {
            var result = token.make('-');
            result.should.eql(token.type.unaryOp);
        });
        it('* returns token.type.unaryOp', function() {
            var result = token.make('*');
            result.should.eql(token.type.unaryOp);
        });
        it('/ returns token.type.unaryOp', function() {
            var result = token.make('/');
            result.should.eql(token.type.unaryOp);
        });
        it('( returns token.type.unaryOp', function() {
            var result = token.make('(');
            result.should.eql(token.type.unaryOp);
        });
        it(') returns token.type.unaryOp', function() {
            var result = token.make(')');
            result.should.eql(token.type.unaryOp);
        });
    });

    describe('with binary operator', function() {
        it('= returns token.type.binaryOp', function() {
            var result = token.make('=');
            result.should.eql(token.type.binaryOp);
        });
    });
});