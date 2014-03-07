var Canvas = function() {
	// This class holds attributes of the canvas
}

Canvas.prototype.width = 100;
Canvas.prototype.height = 100;

Canvas.prototype.points = [];

Canvas.prototype.addPoint = function(x, y) {
	this.points.push([x,y]);
}

Canvas.prototype.transform = function() {
	for (var i = this.points.length - 1; i >= 0; i--) {
		this.points[i][1] = this.height - this.points[i][1];
	};
}

module.exports = Canvas;