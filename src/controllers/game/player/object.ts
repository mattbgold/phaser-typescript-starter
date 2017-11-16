import * as Phaser from 'phaser';

export class PlayerObject {
	accel: number = 1500;
	rot_accel: number = .40;
	
	spr: Phaser.Sprite;
	fistSpr: Phaser.Sprite;
	
	constructor(private _spr: Phaser.Sprite, private _fistSpr: Phaser.Sprite) {
		this.spr = _spr;
		this.spr.anchor.setTo(0.5, 0.5);
		this.spr.body.damping = 0.6;
		this.spr.body.angularDamping = 0.95;
		this.spr.body.maxAngular = 10;
		this.spr.body.mass = 1;
		
		this.fistSpr = _fistSpr;
		this._fistSpr.body.mass = .5;
	}
	
	thrust() {
		this.spr.body.thrust(this.accel);
	}
	
	reverse() {
		this.spr.body.reverse(this.accel);
	}
	
	turnLeft() {
		this.spr.body.angularVelocity -= this.rot_accel;
	}
	
	turnRight() {
		this.spr.body.angularVelocity += this.rot_accel;
	}
	
	punch() {
		this._spr.body.reverse(30000);
		this._fistSpr.body.thrust(90000);
	}
	
	
	getFistDistance(): number {
		return Phaser.Math.distance(this.spr.x, this.spr.y, this.fistSpr.x, this.fistSpr.y) - 65;
	}
}