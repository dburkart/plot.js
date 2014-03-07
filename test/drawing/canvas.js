var should = require('should');
var Canvas = require('../../lib/drawing/canvas');

describe('canvas', function() {
    it('width and height == 100', function() {
        var canvas = new Canvas();

        canvas.width.should.equal(300);
        canvas.height.should.equal(300);
    });

    it('can add points properly', function() {
        var canvas = new Canvas();

        canvas.addPoint(0,1);
        canvas.addPoint(3,4);

        canvas.points.should.containDeep([ [ 0, 3 ], [ 9, 12 ]]);
    });

    it('Points transform properly', function() {
        var canvas = new Canvas();

        canvas.addPoint(0,1);
        canvas.addPoint(3,4);
        canvas.addPoint(5,20);

        canvas.transform();

        canvas.points.should.containDeep([ [ 0, 297 ], [ 9, 288 ], [ 15, 240 ]]);

        canvas.transform();

        canvas.points.should.containDeep([ [ 0, 3 ], [ 9, 12 ], [ 15, 60 ]]);
    });

    it('Converts points to path properly', function() {
        var canvas = new Canvas();

        canvas.addPoint(0,1);
        canvas.addPoint(3,4);
        canvas.addPoint(5,20);

        var path = canvas.convertPointsToSVGPolyline();
        path.should.equal('0,297 9,288 15,240 ');

    });
});