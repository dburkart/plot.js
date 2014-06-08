var util = require('util');

var SVG = function(width, height) {
    this.width  = width;
    this.height = height;

    this.items = [];
};

SVG.prototype.width = 0;
SVG.prototype.height = 0;
SVG.prototype.items = [];
SVG.prototype.defaultStyle = 'fill:none;stroke:black;stroke-width:1';

SVG.prototype.addPolyline = function(points, style) {
    if (style === undefined) {
        style = this.defaultStyle;
    }

    this.items.push(util.format('<polyline points="%s" style="%s" />', points, style));
};

SVG.prototype.addRect = function(width, height) {
    this.items.push(util.format('<rect width="%d" height="%d" style="fill:#99CCFF;" />', width, height));
};

SVG.prototype.addAxes = function(x, y) {
    this.items.push(util.format('<line x1="%d" y1="%d" x2="%d" y2="%d" style="stroke:#CFCFCF;stroke-width:1" />', x[0][0], x[0][1], x[1][0], x[1][1]));
    this.items.push(util.format('<line x1="%d" y1="%d" x2="%d" y2="%d" style="stroke:#CFCFCF;stroke-width:1" />', y[0][0], y[0][1], y[1][0], y[1][1]));
};

SVG.prototype.render = function() {
    return util.format('<svg width="%d" height="%d">%s</svg>', this.width, this.height, this.items.join('\n'));
};

module.exports = SVG;
