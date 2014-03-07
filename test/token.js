var should = require('should');
var token = require('../lib/token');

describe('token.precedence', function() {
    describe('+', function() {
        it('== -', function() {
            var result = token.precedence('+') === token.precedence('-');
            result.should.be.ok;
        });

        it('< *', function() {
            var result = token.precedence('+') < token.precedence('*');
            result.should.be.ok;
        });

        it('< /', function() {
            var result = token.precedence('+') < token.precedence('/');
            result.should.be.ok;
        });
    });

    describe('*', function() {
        it('== /', function() {
            var result = token.precedence('*') === token.precedence('/');
            result.should.be.ok;
        })
    });
});

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
        it('-3 returns token.type.numeric', function() {
            var result = token.make('-3');
            result.should.eql(token.type.numeric);
        });
        it('4.2 returns token.type.numeric', function() {
            var result = token.make('4.2');
            result.should.eql(token.type.numeric);
        });
        it('-4.2 returns token.type.numeric', function() {
            var result = token.make('-4.2');
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
        it('^ returns token.type.unaryOp', function() {
            var result = token.make('^');
            result.should.eql(token.type.unaryOp);
        });
        it('% returns token.type.unaryOp', function() {
            var result = token.make('%');
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

describe('token.validAsPrefix()', function() {
    describe('with (', function() {
        it('returns false', function() {
            token.validAsPrefix('(').should.not.be.ok;
        });
    });

    describe('with )', function() {
        it('returns false', function() {
            token.validAsPrefix(')').should.not.be.ok;
        });
    });

    describe('with *', function() {
        it('returns false', function() {
            token.validAsPrefix('*').should.not.be.ok;
        });
    });

    describe('with /', function() {
        it('returns false', function() {
            token.validAsPrefix('/').should.not.be.ok;
        });
    });

    describe('with +', function() {
        it('returns false', function() {
            token.validAsPrefix('+').should.be.ok;
        });
    });

    describe('with -', function() {
        it('returns false', function() {
            token.validAsPrefix('-').should.be.ok;
        });
    });
});