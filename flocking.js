
function bind(scope,func){
	return function(){
		func.apply(scope,arguments)
	}
}

$(document).ready(function(){
	var flock = new flocking();
	flock.initiate();

});

var flocking = function(){
	this.timeCount = 0;
	this.boids = new Array();
	this.objects = new Array();
	this.canvas = $("#canvas")[0];
	this.ctx  = canvas.getContext("2d");
	this.support = {
    	animationFrame: window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame
	};
	
}


flocking.prototype.draw = function(){
	this.support.animationFrame.call(window, this.funcDraw);
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	
	var now = new Date().getTime(),
	dt = now - (this.timeCount || now);
	this.timeCount = now;

	for (var i = 0; i < this.boids.length; i++) {
		this.boids[i].update();
	};

	for (var i = 0; i < this.objects.length; i++) {
		this.objects[i].draw();
	};
}


flocking.prototype.initiate = function(){
	var boid = new Boid();
	boid.initiate(this,new vector(400,320),new vector(-1,0));
	boid = new Boid();
	boid.initiate(this,new vector(400,360),new vector(-1,0));
	boid = new Boid();
	boid.initiate(this,new vector(400,390),new vector(-1,0));

	boid = new Boid();
	boid.initiate(this,new vector(100,100),new vector(1,1));

	boid = new Boid();
	boid.initiate(this,new vector(200,100),new vector(0,1));

	this.obj = new Object();
	this.obj.initiate(this,new vector(210,320));


	this.obj = new Object();
	this.obj.initiate(this,new vector(310,220));
	this.obj = new Object();
	this.obj.initiate(this,new vector(110,220));
	this.obj = new Object();
	this.obj.initiate(this,new vector(410,420));

	this.obj = new Object();
	this.obj.initiate(this,new vector(510,420));

	this.obj = new Object();
	this.obj.initiate(this,new vector(510,320));

	// var boid = new Boid();
	// boid.initiate(this,new vector(500,300),new vector(-1,0));
	// var boid = new Boid();
	// boid.initiate(this,new vector(500,250),new vector(-1,0));
	// var boid = new Boid();
	// boid.initiate(this,new vector(200,200),new vector(-1,0));
	// var boid = new Boid();
	// boid.initiate(this,new vector(150,30),new vector(1,1));

	//var boid = new Boid();
	//boid.initiate(this,new vector(30,30),new vector(1,2));
	
	// var boid = new Boid();
	// boid.initiate(this,new vector(200,30),new vector(-1,1));
	// var boid = new Boid();
	// boid.initiate(this,new vector(350,30),new vector(1,1));

	this.funcDraw = bind(this,this.draw);
	this.support.animationFrame.call(window, this.funcDraw);
}

