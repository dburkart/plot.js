var Canvas = function() {
	this.points = [];
}

Canvas.prototype.width = 300;
Canvas.prototype.height = 300;

Canvas.prototype.x_scale = 100;
Canvas.prototype.y_scale = 100;

Canvas.prototype.points = [];

Canvas.prototype.addPoint = function(x, y) {
	if (x > this.x_scale || y > this.y_scale) return;

	// Convert point to absolute coordinates
	var converted_x = Math.round(x * (this.width / this.x_scale));
	var converted_y = Math.round(y * (this.height / this.y_scale));

	this.points.push([converted_x, converted_y]);
}

Canvas.prototype.transform = function() {
	for (var i = this.points.length - 1; i >= 0; i--) {
		this.points[i][1] = this.height - this.points[i][1];
	};
}

Canvas.prototype.convertPointsToSVGPolyline = function() {
	var path = '';
	var i = 0;

	this.transform();

	for (var i = 0; i < this.points.length; i++) {
		path += this.points[i][0] + ',' + this.points[i][1] + ' ';
	};

	return path;
}

module.exports = Canvas;