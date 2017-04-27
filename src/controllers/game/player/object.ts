import * as Phaser from 'phaser';

export class PlayerObject {
	accel: number = .5;
	max_speed: number = 6;
	
	
	constructor(private _spr: Phaser.Sprite) { }	
}