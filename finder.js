class Finder {
	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.vel = random(0.5, 1.5);
		this.course = 0;
		this.detectionRadius = random(80, 120);
		this.breedAllowance = random(900, 1100);
		this.energyGiven = random(200, 300);
		this.breedTimer = 0;
		this.breedDistance = 20;
		this.energy = 600;
		this.dead = false;
		this.eatRadius = random(9, 11);
	}
	act() {
		this.breedTimer--;
		this.wallStop();
		var closest = this.findClosest();
		if(this.breedTimer <= 0) {
			if(this.energy > 0) {
				if(closest != null && dist(this.x,this.y,closest.x,closest.y) < this.detectionRadius) {
					this.setCourse(closest);
					this.move();
					this.eat(closest);
				} else {
					this.wander();
				}
			} else {
				this.dead = true;
			}
			this.breed();
		} else {
			this.move();
		}
		if (this.energy >= 200) {
      		fill(0, 255, 0);
	    } else if (this.energy >= 80) {
	        fill(255, 255, 0);
	    } else {
	        fill(255, 0, 0);
	    }
		circle(this.x,this.y,10);
		push();
		noFill();
		stroke(255,0,255);
		circle(this.x,this.y,this.detectionRadius * 2);
		pop();
	}
	move() {
		var dx = cos(radians(this.course)) * this.vel;
		var dy = sin(radians(this.course)) * this.vel;
		this.x += dx;
		this.y += dy;
		this.energy--;
	}
	findClosest() {
		var f = null;
		if(food.length > 0) {
			f = food[0];
			var d = dist(this.x,this.y,f.x,f.y);
			for(let i = 0; i < food.length; i++) {
				var t = food[i];
				var newDist = dist(this.x,this.y,t.x,t.y);
				if(newDist < d) {
					f = t;
					d = newDist;
				}	
			}
		}
		return f;
	}
	setCourse(f) {
		if(f != null) {
			var dx = this.x - f.x;
			var dy = this.y - f.y;
			if(this.x < f.x) {
				this.course = degrees(atan(dy/dx));
			} else {
				this.course = degrees(atan(dy/dx)) + 180;
			}
		}
	}
	eat(f) {
		if(f != null) {
			if(dist(this.x,this.y,f.x,f.y) < this.eatRadius) {
				f.eaten = true;
				this.energy += 150;
			}
		}
	}
	wander() {
		this.course += random(-10,10);
		this.move();
		this.wallStop();
	}
	wallStop() {
		if(this.x < 0) {
			this.x = 0;
			this.wallReact();
		} else if (this.x > width) {
			this.x = width;
			this.wallReact();
		}
		if(this.y < 0) {
			this.y = 0;
			this.wallReact();
		} else if (this.y > height) {
			this.y = height;
			this.wallReact();
		}
	}
	wallReact() {
		this.course += 135;
	}
	breed() {
		if(this.energy >= this.breedAllowance) {
			const mate = this.findMate();
			if(mate != null && dist(this.x, this.y, mate.x, mate.y) < this.breedDistance + mate.breedDistance && mate.energy >= mate.breedAllowance) {
				const newF = new Finder((this.x + mate.x)/2, (this.y + mate.y)/2);
				newF.energy = this.energyGiven + mate.energyGiven;
				newF.detectionRadius = abs(this.geneDecide(this.detectionRadius, mate.detectionRadius));
		        newF.eatRadius = abs(this.geneDecide(this.eatRadius, mate.eatRadius));
		        newF.vel = abs(this.geneDecide(this.vel, mate.vel));
		        newF.breedAllowance = abs(this.geneDecide(this.breedAllowance, mate.breedAllowance));
		        newF.energyGiven = abs(this.geneDecide(this.energyGiven, mate.energyGiven));
		        newF.breedDistance = abs(this.geneDecide(this.breedDistance, mate.breedDistance));
		       	this.energy -= this.energyGiven;
		        mate.energy -= mate.energyGiven;
		        newF.course = random(0, 360);
		        newF.breedTimer = 75;
				finders.push(newF);
				this.course = random(360);
		        mate.course = random(360);
		        this.breedTimer = 75;
		        mate.breedTimer = 75;
			}
		}
	}
	findMate() {
		const me = this;
		var f = null;
		if(finders.length > 1) {
			f = finders[0];
			if(f == me) {
				f = finders[1];
			}
			var distance = dist(this.x, this.y, f.x, f.y);
			for(let i = 0; i < finders.length; i++) {
				var t = finders[i];
				const newDistance = dist(this.x, this.y, t.x, t.y);
				if(newDistance < dist && t != me) {
					f = t;
					distance = newDistance;
				}
			}
		}
		return f;
	}
	geneDecide(first, second) {
		var result = random(min(first, second), max(first, second));
		if(random(1) < MUTATIONRATE) {
			result = random(result-min(first,second) * MUTATIONAMOUNT, result+max(first,second) * MUTATIONAMOUNT);
		}
		return result;
	}
}