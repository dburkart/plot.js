var should = require('should');
var Parser = require('../lib/parser');

describe('Parser.eval()', function() {
    describe('with \'1 + 2\'', function() {
        it('returns 3', function() {
            var parser = new Parser('1 + 2');
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
            var parser = new Parser('2 * 5');
            parser.eval().should.eql(10);
        });
    });

    describe('with \'2 * -5\'', function() {
        it('returns -10', function() {
            var parser = new Parser('2 * -5');
            parser.eval().should.eql(-10);
        });
    });

    describe('with \'5 * 3.21\'', function() {
        it('returns 16.05', function() {
            var parser = new Parser('5 * 3.21');
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
});