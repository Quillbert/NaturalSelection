class Food {
	constructor() {
		this.x = random(width);
		this.y = random(height);
		this.eaten = false;
	}
	act() {
		fill(0,0,255);
		circle(this.x,this.y,5);
	}
}