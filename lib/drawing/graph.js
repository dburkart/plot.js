var Graph = function() {
	this.points = [];
	this.x = {min: null, max: null};
	this.y = {min: null, max: null};
}

Graph.prototype.x = {};
Graph.prototype.y = {};

Graph.prototype.points = [];

Graph.prototype.addPoint = function(x, y) {
	if ( !this.x.locked && (this.x.min === null || x < this.x.min) ) this.x.min = x * .8;
	if ( !this.x.locked && (this.x.max === null || x > this.x.max) ) this.x.max = x * 1.2;
	if ( !this.y.locked && (this.y.min === null || y < this.y.min) ) this.y.min = y * .8;
	if ( !this.y.locked && (this.y.max === null || y < this.y.max) ) this.y.max = y * 1.2;

	this.points.push([x, y]);
}

Graph.prototype.setBoundsX = function(min, max) {
	this.x.min = min;
	this.x.max = max;

	this.x.locked = true;
}

Graph.prototype.setBoundsY = function(min, max) {
	this.y.min = min;
	this.y.max = max;

	this.y.locked = true;
}

Graph.prototype.sizeX = function() {
	return this.x.max - this.x.min;
}

Graph.prototype.sizeY = function() {
	return this.y.max - this.y.min;
}

module.exports = Graph;