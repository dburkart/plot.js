var should = require('should');
var Canvas = require('../../lib/drawing/canvas');

describe('canvas', function() {
    it('width and height == 100', function() {
        var canvas = new Canvas();

        canvas.width.should.equal(100);
        canvas.height.should.equal(100);
    });

    it('can add points properly', function() {
        var canvas = new Canvas();

        canvas.addPoint(0,1);
        canvas.addPoint(3,4);

        canvas.points.should.containDeep([[0,1], [3,4]]);
    });

    it('Points transform properly', function() {
        var canvas = new Canvas();

        canvas.addPoint(0,1);
        canvas.addPoint(3,4);

        canvas.transform();

        canvas.points.should.containDeep([[0,99], [3,96]]);

        canvas.transform();

        canvas.points.should.containDeep([[0,1], [3,4]]);
    });
});