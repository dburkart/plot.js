var Graph = require('../../lib/drawing/graph');

var Canvas = function() {
    this.graph = new Graph();
    this.width = 300;
    this.height = 300;
};

Canvas.prototype.width = 300;
Canvas.prototype.height = 300;

Canvas.prototype.graph = {};

Canvas.prototype.translatePoint = function(x, y) {
    var x_scaling_factor = (this.width / (this.graph.x.max - this.graph.x.min));
    var y_scaling_factor = (this.height / (this.graph.y.max - this.graph.y.min));

    var converted_x = ((x - this.graph.x.min) * x_scaling_factor);
    var converted_y = ((y - this.graph.y.min) * y_scaling_factor);

    return [converted_x, converted_y];
};

Canvas.prototype.points = function() {
    var pts = [];

    for (var i = 0; i < this.graph.points.length; i++ ) {
        pts[i] = this.translatePoint(this.graph.points[i][0], this.graph.points[i][1]);
    }

    return pts;
};

Canvas.prototype.addPoint = function(x, y) {
    this.graph.addPoint(x, y);
};

Canvas.prototype.transform = function(pts) {
    if (pts === undefined) {
        pts = this.points();
    }

    for (var i = pts.length - 1; i >= 0; i--) {
        pts[i][1] = this.height - pts[i][1];
    }

    return pts;
};

Canvas.prototype.convertPointsToSVGPolyline = function() {
    var path = '';
    var i;

    var pts = this.transform();

    for (i = 0; i < pts.length; i++) {
        path += pts[i][0] + ',' + pts[i][1] + ' ';
    }

    return path;
};

Canvas.prototype.axes = function() {
    var x_axis = [];
    var y_axis = [];

    return [
        this.transform([this.translatePoint(this.graph.x.min, 0), this.translatePoint(this.graph.x.max, 0)]),
        this.transform([this.translatePoint(0, this.graph.y.min), this.translatePoint(0, this.graph.y.max)])
    ];
};

module.exports = Canvas;
