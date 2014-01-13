var Boid = function(){
	this.position = new vector(0,0);
	this.velocity = new vector(0,0);
	this.acceleration = new vector(0,0);
	this.maxSpeed = 1.5;
	this.maxforce = 0.03;
	this.color = "blue";
	this.flocking = null;
	this.neighbours = new Array();
}

Boid.prototype.initiate = function(flocking,position,velocity){
	this.position = position;
	this.velocity = velocity;
	this.flocking = flocking;
	this.flocking.boids.push(this);
}

Boid.prototype.draw = function(){
	this.flocking.ctx.beginPath();
	this.flocking.ctx.fillStyle = '#0000FF';
	this.flocking.ctx.arc(this.position.x,this.position.y,4,0,2*Math.PI);
	this.flocking.ctx.fill();
	this.flocking.ctx.closePath();
}

Boid.prototype.applyForce =function(force){
	this.acceleration = this.acceleration.add(force);
}

Boid.prototype.getAvoidence = function(){
	var force = new vector(0,0);


	for (var i = 0; i < this.flocking.objects.length; i++) {
		this.flocking.objects[i];
		var checkLenght = 50;
		var forward = this.velocity.clone();
		forward.normalize();
		var diff = this.flocking.objects[i].position.substract(this.position);
		var dotProd = diff.getDotProd(forward);

		if(dotProd > 0){
			
			var ray = forward.clone();
			ray = ray.multiply(checkLenght);
			var projection = forward.clone();
			projection = projection.multiply(dotProd);
			var dist = projection.substract(diff);

			dist = dist.getLength();

			if(dist < 10 && projection.getLength() < ray.getLength()){
				force = forward.clone();
				var angle = diff.sign(this.velocity) * Math.PI /2;
				force.setAngle(angle);
				force.normalize();
			}
		}
	
	};
	
	return force;
}



Boid.prototype.update = function(dt){
	this.neighbours = this.getNeighbours();
	var edge = this.checkEdges();
	var sep = this.getSeparation();
	var alig = this.getAlignment();
	var coh = this.getCohesion();
	
	var avoidence = this.getAvoidence();

	sep = sep.multiply(2.5);
	alig = alig.multiply(1.2);
	coh  = coh.multiply(1.0);
	avoidence = avoidence.multiply(1.5);
	edge = edge.multiply(2.0);
	this.applyForce(sep);
	this.applyForce(alig);
	this.applyForce(coh);
	this.applyForce(edge);

	this.applyForce(avoidence);

	this.velocity = this.velocity.add(this.acceleration);
	this.velocity.limit(2);
	this.position = this.position.add(this.velocity);
	this.acceleration = this.acceleration.multiply(0);

	this.draw();
}

Boid.prototype.getDirection = function(value){

	switch(value){

		case 0:

		return new vector(1,-1);

		case 1:
		return new vector(1,1);

		case 2:
		return new vector(-1,1);

		case 3:
		return new vector(-1,-1);
	}
}

Boid.prototype.checkEdges = function(){

	var force = new vector(0,0);
	var edges = [0,0,800,600];
	var multi = -100;


	for (var i = 0; i < edges.length; i++) {
		 var e = edges[i];
		 var dist = 0;
		 if(i % 2  == 0 ) dist = Math.abs(this.position.x - e);
		 else dist = Math.abs(this.position.y - e);
		 
		 var value = this.getDirection(i);
		 if(dist < 50){
		   multi += dist;
		   multi =  Math.abs(multi) * 0.001;
		   force = force.add(new vector(multi*value.x,multi*value.y));
		   force.limit(this.maxforce);
		}
	};

	return force;

}

Boid.prototype.seek = function(vec){
	var target = vec.substract(this.position);
	target.normalize();
	target.multiply(this.maxSpeed);
	var force = target.substract(this.velocity);
	force.limit(this.maxforce);
	return force;
}

Boid.prototype.getCohesion = function(){
    var force = new vector(0,0);
    var count = 0;
	if(this.neighbours.length == 0) return force;
    for (var i = 0; i < this.neighbours.length; i++) {
    	 var b = this.neighbours[i];
    	  var dist = this.position.distance(b.position);
    	  if(dist<30 && dist > 0){
    	  	force = force.add(b.position);
    	  	count++;
    	  }
    };

    if(count > 0){
    	force = force.divide(count);
    	return this.seek(force);
    }  	
    return force;
}


Boid.prototype.getSeparation = function(){
	var force = new vector(0,0);
	var count = 0;
	if(this.neighbours.length == 0) return force;
	for (var i = 0; i < this.neighbours.length; i++) {
    	  var b = this.neighbours[i];
    	  var dist = this.position.distance(b.position);
    	   if(dist<20 && dist > 0){
    	  	 var diff = new vector(this.position.x - b.position.x,this.position.y-b.position.y);
    	  	 diff.normalize();
    	  	 diff = diff.divide(dist);
    	  	 force = force.add(diff);
    	  	 count++;
    	  }
    };

    if(count > 0){
    	force = force.divide(count);
    }

    if(force.getLength() > 0){
    	force.normalize();
    	force = force.multiply(this.maxSpeed);
    	force = force.substract(this.velocity);
    	force.limit(this.maxforce);
    }
    return force;
}

Boid.prototype.getAlignment = function(){
	var force = new vector(0,0);
	var distance = 100;
	var count = 0;
	if(this.neighbours.length == 0) return force;
	for (var i = 0; i < this.neighbours.length; i++) {
    	 var b = this.neighbours[i];
    	 var d = this.position.distance(b.position);
    	 if(d > 0 && d<distance){
    	 	force =  force.add(b.velocity);
    	 	count++;
    	 }
    };

    if(count > 0){
    	force = force.divide(count);
    	force.normalize();
    	force = force.multiply(this.maxSpeed);
    	force = force.substract(this.velocity);
    	force.limit(this.maxforce);
    }
    return force;
}


Boid.prototype.getNeighbours = function(){
	var list = new Array();
	for (var i = 0; i < this.flocking.boids.length; i++) {
		 var b = this.flocking.boids[i];
		 if(b == this)continue;
		 var distance = this.position.distance(b.position);
		 if(distance < 100){
		 	list.push(b);
		 }
	};
	return list;
}

