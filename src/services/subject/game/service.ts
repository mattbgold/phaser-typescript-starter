import * as Phaser from 'phaser'
import {BaseSubject} from "../base";
import {injectable} from "inversify";
import {PlayerObject} from "../../../controllers/game/player/object";
import {AsteroidObject} from "../../../controllers/game/asteroids/object";

@injectable()
export class GameSubject extends BaseSubject {
	constructor() {
		super();
	}
	
	player: PlayerObject;
	asteroids: AsteroidObject[];
	
	asteroidGroup: Phaser.Group;
	
	asteroidCollisionGroup: Phaser.Physics.P2.CollisionGroup;
	playerCollisionGroup: Phaser.Physics.P2.CollisionGroup;
}