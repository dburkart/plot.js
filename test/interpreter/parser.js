var should = require('should');
var Parser = require('../../lib/interpreter/parser');
var Lexer = require('../../lib/interpreter/lexer');

describe('Parser.eval()', function() {
    describe('with \'1\'', function() {
        it('returns 1', function() {
            var parser = new Parser('1');
            parser.eval().should.equal(1);
        });
    });

    describe('with \'\n3\'', function() {
        it('returns 3', function() {
            var parser = new Parser('\n3');
            parser.eval().should.be.equal(3);
        });
    });

    describe('with \'x = 3\nx\'', function() {
        it('returns 3', function() {
            var parser = new Parser('x = 3\nx');
            parser.eval().should.equal(3);
        });
    });

    describe('with \'x = 3 , 4\nx\'', function() {
        it('returns 4', function() {
            var parser = new Parser('x = 3 , 4\nx');
            parser.eval().should.equal(4);
        });
    });

    describe('with \'y = 4\nx = y, y+1\nx\'', function() {
        it('returns 5', function() {
            var parser = new Parser('y = 4\nx = y, y + 1\nx');
            parser.eval().should.equal(5);
        });
    });

    describe('with \'1 + 2\'', function() {
        it('returns 3', function() {
            var parser = new Parser('1 + 2');
            parser.eval().should.eql(3);
        });
    });

    describe('with \'1+2\'', function() {
        it('returns 3', function() {
            var parser = new Parser('1+2');
            parser.eval().should.eql(3);
        });
    });

    describe('with \'4 - 2\'', function() {
        it('returns 2', function() {
            var parser = new Parser('4 - 2');
            parser.eval().should.eql(2);
        });
    });

    describe('with \'1 - 2\'', function() {
        it('returns -1', function() {
            var parser = new Parser('1 - 2');
            parser.eval().should.eql(-1);
        });
    });

    describe('with \'2 * 5\'', function() {
        it('returns 10', function() {
            var parser = new Parser('2 *5');
            parser.eval().should.eql(10);
        });
    });

    describe('with \'2 * -5\'', function() {
        it('returns -10', function() {
            var parser = new Parser('2* -5');
            parser.eval().should.eql(-10);
        });
    });

    describe('with \'5 * 3.21\'', function() {
        it('returns 16.05', function() {
            var parser = new Parser('5*3.21');
            parser.eval().should.eql(16.05);
        });
    });

    describe('with \'10 / 2\'', function() {
        it('returns 5', function() {
            var parser = new Parser('10 / 2');
            parser.eval().should.eql(5);
        });
    });

    describe('with \'100 / 3\'', function() {
        it('returns 33.33', function() {
            var parser = new Parser('100 / 3');
            parser.eval().should.be.approximately(33.33, 0.01);
        });
    });

    describe('with \'23 / -4\'', function() {
        it('returns -5.75', function() {
            var parser = new Parser('23 / -4');
            parser.eval().should.be.equal(-5.75);
        });
    });

    describe('with \'10 % 2\'', function() {
        it('returns 0', function() {
            var parser = new Parser('10 % 2');
            parser.eval().should.be.equal(0);
        });
    });

    describe('with \'10 % 3\'', function() {
        it('returns 1', function() {
            var parser = new Parser('10%3');
            parser.eval().should.be.equal(1);
        });
    });

    describe('with \'10 * 10 % 3\'', function() {
        it('returns 1', function() {
            var parser = new Parser('10 * 10 % 3');
            parser.eval().should.be.equal(1);
        });
    });

    describe('with \'10 % 3 * 10\'', function() {
        it('returns 10', function() {
            var parser = new Parser('10 % 3 * 10');
            parser.eval().should.be.equal(10);
        });
    });

    describe('with \'4 ^ 3\'', function() {
        it('returns 64', function() {
            var parser = new Parser('4 ^ 3');
            parser.eval().should.be.equal(64);
        });
    });

    describe('with \'4 ^ 3 * 2\'', function() {
        it('returns 64', function() {
            var parser = new Parser('4 ^ 3 * 2');
            parser.eval().should.be.equal(128);
        });
    });

    describe('with \'2 * 4 ^ 3\'', function() {
        it('returns 64', function() {
            var parser = new Parser('2 * 4 ^ 3');
            parser.eval().should.be.equal(128);
        });
    });

    // Test order-of-operations
    describe('with \'4 + 2 * 6\'', function() {
        it('returns 16', function() {
            var parser = new Parser('4 + 2 * 6');
            parser.eval().should.be.equal(16);
        });
    });

    describe('with \'6 * 2 + 4\'', function() {
        it('returns 16', function() {
            var parser = new Parser('6 * 2 + 4');
            parser.eval().should.be.equal(16);
        });
    });

    describe('with \'4 - 2 * 6\'', function() {
        it('returns -8', function() {
            var parser = new Parser('4 - 2 * 6');
            parser.eval().should.be.equal(-8);
        });
    });

    describe('with \'6 * 2 - 4\'', function() {
        it('returns 8', function() {
            var parser = new Parser('6 * 2 - 4');
            parser.eval().should.be.equal(8);
        });
    });

    describe('with \'10 / 5 * 6\'', function() {
        it('returns 12', function() {
            var parser = new Parser('10 / 5 * 6');
            parser.eval().should.be.equal(12);
        });
    });

    describe('with \'6 * 4 / 3\'', function() {
        it('returns 8', function() {
            var parser = new Parser('6 * 4 / 3');
            parser.eval().should.be.equal(8);
        });
    });

    // Test parenthesis
    describe('with \'(4 + 2) * 6\'', function() {
        it('returns 36', function() {
            var parser = new Parser('(4 + 2) * 6');
            parser.eval().should.be.equal(36);
        });
    });

    // Test adding negative numbers
    describe('with \'8 + -4\'', function() {
        it('returns 4', function() {
            var parser = new Parser('8 + -4');
            parser.eval().should.be.equal(4);
        });
    });

    describe('with multiline input', function() {
        it("'8 + 2\n11 - 3' returns 8", function() {
            var parser = new Parser('8 + 2\n11 - 3');
            parser.eval().should.be.equal(8);
        })
    });

    describe("with multiline input 'x,\n2\'", function() {
        it('returns 2', function() {
            var parser = new Parser('x,\n2');
            parser.eval().should.be.equal(2);
        })
    })

    // Test variable assignment
    describe('variable assignment', function () {
        it("'a = 2' returns 2", function() {
            var parser = new Parser('a = 2');
            parser.eval().should.be.equal(2);
        });

        it("'a = 2\n4 * a' returns 8", function() {
            var parser = new Parser('a = 2\n4 * a');
            parser.eval().should.be.equal(8);
        })

        it("'a = 2\na = 3 * a' returns 6", function() {
            var parser = new Parser('a = 2\na = 3 * a');
            parser.eval().should.be.equal(6);
        })

        it("'foo = 2\nfoo' returns 2", function() {
            var parser = new Parser('foo = 2\nfoo');
            parser.eval().should.be.equal(2);
        })

        it("'foo = 10\nfoo * foo' returns 100", function() {
            var parser = new Parser('foo = 10\nfoo * foo');
            parser.eval().should.be.equal(100);
        })
    });

    describe('function definition', function() {
        it("'f(x) = 2 * x' returns true", function() {
            var parser = new Parser('f(x) = 2 * x');
            parser.eval().should.be.ok;
        });

        it("'f(x) = 2 * x\nf(4)' returns 8", function() {
            var parser = new Parser('f(x) = 2 * x\nf(4)');
            parser.eval().should.be.equal(8);
        });

        it("'f() = 4' returns true", function() {
            var parser = new Parser('f() = 4');
            parser.eval().should.be.ok;
        });

        it("'f() = 4\nf() * f()' returns 16", function() {
            var parser = new Parser('f() = 4\nf() * f()');
            parser.eval().should.be.equal(16);
        });
    });

    describe('multiline function definition', function() {
        it("'f(x) = x = 2 + x,\n2 * x' returns true", function() {
            var parser = new Parser('f(x) = x = 2 + x,\n2 * x');
            parser.eval().should.be.ok;
        });

        it("'f(x) = x = 2 + x,\n2 * x\nf(2)' returns 8", function() {
            var parser = new Parser('f(x) = x = 2 + x,\n2 * x\nf(2)');
            parser.eval().should.be.equal(8);
        });
    });

    describe('function definitions consisting of function calls', function() {
        it("'f(x) = x * 2\ng(x) = f(x)\ng(2)' returns 4", function() {
            var parser = new Parser('f(x) = x * 2\ng(x) = f(x)\ng(2)');
            parser.eval().should.be.equal(4);
        });
        it("'f(x) = 2 * x\ng(x) = f(x)\ng(4)\ng(10)'", function() {
            var parser = new Parser('f(x) = 2 * x\ng(x) = f(x)\ng(4)\ng(10)');
            parser.eval().should.be.equal(20);
        });
    });

    describe('nested function calls', function() {
        it("'f(x) = 2 * x\ng(x) = x + 3\ng(f(4))' returns 11", function() {
            var parser = new Parser('f(x) = 2 * x\ng(x) = x + 3\ng(f(4))');
            parser.eval().should.be.equal(11);
        });
        it("'f(x) = 2 * x\nsqrt(f(8))' returns 4", function() {
            var parser = new Parser('f(x) = 2 * x\nsqrt(f(8))');
            parser.eval().should.be.equal(4);
        });
    });

    describe('expressions in function calls', function() {
        it("'n = 2\nf(x) = 2 * x\nf( n * 2 )' returns 8", function() {
            var parser = new Parser('n = 2\nf(x) = 2 * x\nf( n * 2 )');
            parser.eval().should.be.equal(8);
        });
    });

    describe('Parenthesis are weird: ', function() {
        it("'f() = (sin(3) + cos(4)) * 7\nf()' returns ", function() {
            var parser = new Parser('f() = (sin(3) + cos(4)) * 7\nf()');
            parser.eval().should.be.approximately(-3.58, 0.01);
        })
    })

    // Test parse errors
    describe('call of undefined function', function() {
        it("'f(2)' returns error message", function() {
            var result;
            try {
                var parser = new Parser('f(2)');
                parser.eval();
            } catch (err) {
                err.should.be.eql("Function 'f' has not been defined.");
            }
        });
    });

    describe('usage of undefined variable', function() {
        it("'x' returns error message", function() {
            var result;
            try {
                var parser = new Parser('x');
                parser.eval();
            } catch (err) {
                err.should.be.eql("Variable 'x' has not been defined.");
            }
        });
    });
});
