var Object = function(){
	this.position = new vector(200,200);
	this.color = "red";
	this.flocking = null;
	this.neighbours = new Array();
}

Object.prototype.initiate = function(flocking,position){
	this.position = position;
	this.flocking = flocking;
	this.flocking.objects.push(this);
}

Object.prototype.draw = function(){

	this.flocking.ctx.beginPath();
	this.flocking.ctx.fillStyle = this.color;
	this.flocking.ctx.arc(this.position.x,this.position.y,4,0,2*Math.PI);
	this.flocking.ctx.fill();
	this.flocking.ctx.closePath();
}

