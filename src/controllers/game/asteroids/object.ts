import * as Phaser from 'phaser';
import {Asteroid} from "../../../models/asteroid";

export class AsteroidObject {
	private _isDamaged: boolean = false;
	
	model: Asteroid;

	collidedThisFrame: boolean = false;
	spr: Phaser.Sprite;
	

	constructor(spr: Phaser.Sprite, model: Asteroid) {
		this.spr = spr;
		this.spr.body.mass = model.mass;
		this.model = model;

		if (!this.model.forceToDamage) {
			this._isDamaged = true;
		}
	}
	
	impact(force: number):boolean {
		this.collidedThisFrame = true;
		
		if( !this._isDamaged && force >= this.model.forceToDamage) {
			this._isDamaged = true;
			this.spr.loadTexture(`${this.model.currentAsset}-cracked`);
		}
		else if (this._isDamaged && force >= this.model.forceToDestroy) {
			return true;
		}
		
		return false;
	}
}