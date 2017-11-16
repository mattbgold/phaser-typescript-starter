import * as Phaser from 'phaser';
import {BaseController} from "../../base";
import {InputSubject} from "../../../services/subject/input/service";
import Game = Phaser.Game;
import {GameSubject} from "../../../services/subject/game/service";
import {injectable, inject} from "inversify";
import {GameEvent} from "../../../services/subject/game/event";
import {AsteroidObject} from "./object";
import {GameConfig} from "../../../config";
import {ContainerKeys} from "../../../inversify.config";
import {Asteroid} from "../../../models/asteroid";

@injectable()
export class AsteroidsController extends BaseController {

	private _asteroids: AsteroidObject[];

	constructor(
		private _game: Game,
		@inject(ContainerKeys.CONFIG) private _config: GameConfig,
		private _gameSubject: GameSubject
	) {
		super();
	}

	preload() {
		this._gameSubject.subscribe(GameEvent.AsteroidPunch, bodies => this._handlePunch(bodies.fist, bodies.asteroid));
	}

	create() {
		this._asteroids = this._gameSubject.asteroids;

		this._asteroids.forEach(a => a.spr.body.onBeginContact.add(body => this._handleCollision(a, body)));
	}

	update() {
		this._asteroids.forEach(a => a.collidedThisFrame = false);
	}

	private _handleCollision = (asteroid: AsteroidObject, collidingBody: Phaser.Physics.P2.Body) => {
		if (asteroid.collidedThisFrame || collidingBody === null)
			return;  // we collided with world bounds or already collided

		let v1 = asteroid.spr.body.data.velocity;
		let v2 = collidingBody.data.velocity;

		let collidingBodyMass = collidingBody.mass;

		if (collidingBody.sprite.key === 'fist') {
			collidingBodyMass = 1; // artificially beef up the fist
		}

		let collidingBodyRelativeSpeed = Phaser.Point.distance(
			new Phaser.Point(v2[0],v2[1]),
			new Phaser.Point(v1[0], v1[1])
		);

		let impactMomentum = collidingBodyRelativeSpeed * collidingBodyMass;

		let isDestroyed = asteroid.impact(impactMomentum);

		if (isDestroyed) {
			this._makeChildren(asteroid, v2, impactMomentum);
			asteroid.spr.kill();
		}
	}

	private _handlePunch = (fist, asteroid) => {
	}

	private _makeChildren(destroyedRoid: AsteroidObject, collidingVelocity: any, impactMomentum: number) {
		let nextTier = this._config.asteroidTiers[destroyedRoid.model.tier + 1];
		if (!nextTier) {
			return;
		}

		for(let i = 0; i < 3; i++) {
			let model: Asteroid = Object.assign({}, nextTier);

			model.currentAsset = Phaser.ArrayUtils.getRandomItem(model.assetPool);

			let asteroidSpr = this._gameSubject.asteroidGroup.create(destroyedRoid.spr.x -30 +(Math.random()*60), destroyedRoid.spr.y -30 +(Math.random()*60), model.currentAsset);
			asteroidSpr.body.debug = this._config.debug;
			asteroidSpr.anchor.setTo(0.5, 0.5);	

			asteroidSpr.body.clearShapes();
			asteroidSpr.body.loadPolygon('sprite_physics', model.currentAsset);
			asteroidSpr.body.setCollisionGroup(this._gameSubject.asteroidCollisionGroup);
			asteroidSpr.body.collides([this._gameSubject.asteroidCollisionGroup, this._gameSubject.playerCollisionGroup]);

			let relativeVelocity = [collidingVelocity[0] - destroyedRoid.spr.body.data.velocity[0], collidingVelocity[1] - destroyedRoid.spr.body.data.velocity[1]];

			asteroidSpr.body.rotation = destroyedRoid.spr.body.rotation;
			asteroidSpr.body.velocity.x = destroyedRoid.spr.body.velocity.x;// + relativeVelocity[0] * impactMomentum;
			asteroidSpr.body.velocity.y = destroyedRoid.spr.body.velocity.y;// + relativeVelocity[1] * impactMomentum;

			let obj = new AsteroidObject(asteroidSpr, model);
			this._gameSubject.asteroids.push(obj);
			obj.spr.body.onBeginContact.add(body => this._handleCollision(obj, body));
		}
	}
}