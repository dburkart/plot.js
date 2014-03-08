var should = require('should');
var Graph = require('../../lib/drawing/graph');

describe('Graph', function() {
    it('with point 1,1', function() {
        var graph = new Graph();

        graph.addPoint(1, 1);

        graph.x.min.should.equal(1);
        graph.x.max.should.equal(1);
        graph.y.min.should.equal(1);
        graph.y.max.should.equal(1);
    });

    it('with setting bounds and then adding points', function() {
        var graph = new Graph();

        graph.setBoundsX(-1, 1);

        graph.addPoint(3, 1);

        graph.x.min.should.equal(-1);
        graph.x.max.should.equal(1);
        graph.y.min.should.equal(1);
        graph.y.max.should.equal(1);
    });

    it('with setting bounds and then adding points', function() {
        var graph = new Graph();

        graph.setBoundsY(-1, 1);

        graph.addPoint(1, -3);

        graph.x.min.should.equal(1);
        graph.x.max.should.equal(1);
        graph.y.min.should.equal(-1);
        graph.y.max.should.equal(1);
    });

    it('with sizeX, sizeY', function() {
        var graph = new Graph();

        graph.setBoundsX(4, 8)
        graph.setBoundsY(-2, 3);

        graph.sizeX().should.equal(4);
        graph.sizeY().should.equal(5);
    });
});