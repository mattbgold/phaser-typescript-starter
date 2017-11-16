import * as Phaser from 'phaser'
import {injectable, inject} from "inversify";
import Game = Phaser.Game;
import Signal = Phaser.Signal;
import {BaseController} from "../base";
import {PlayerObject} from "./player/object";
import {GameSubject} from "../../services/subject/game/service";
import {GameConfig} from "../../config";
import {AsteroidObject} from "./asteroids/object";
import {ContainerKeys} from "../../inversify.config";
import {GameEvent} from "../../services/subject/game/event";
import {Asteroid} from "../../models/asteroid";

@injectable()
export class GameController extends BaseController {
	constructor(
		private _game: Game,
		@inject(ContainerKeys.CONFIG) private _config: GameConfig,
		private _gameSubject: GameSubject
	) {
		super();
	}

	preload() {
		this._game.load.image('ship', 'assets/ship/yellow_small.png');
		this._game.load.image('fist', 'assets/punch/fist_small.png');
		this._game.load.image('extender', 'assets/punch/extender_small.png');
		
		this._game.load.image('roid-oval', 'assets/roids/oval.png');
		this._game.load.image('roid-oval-cracked', 'assets/roids/oval-cracked.png');
		this._game.load.image('roid-long', 'assets/roids/long.png');
		this._game.load.image('roid-long-cracked', 'assets/roids/long-cracked.png');
		this._game.load.image('roid-round', 'assets/roids/round.png');
		this._game.load.image('roid-round-cracked', 'assets/roids/round-cracked.png');
		this._game.load.image('roid-broken-1', 'assets/roids/broken-1.png');
		this._game.load.image('roid-broken-2', 'assets/roids/broken-2.png');
		this._game.load.image('roid-broken-3', 'assets/roids/broken-3.png');
		this._game.load.image('roid-broken-4', 'assets/roids/broken-4.png');
		this._game.load.image('roid-broken-tiny-1', 'assets/roids/broken-tiny-1.png');
		this._game.load.image('roid-broken-tiny-2', 'assets/roids/broken-tiny-2.png');
		
		this._game.load.physics('sprite_physics', 'assets/sprite_physics.json');
	}
	
	create() {
		this._game.world.setBounds(0,0,this._config.mapWidth, this._config.mapHeight);

		this._game.stage.backgroundColor = '#111';
		
		//physics
		this._game.physics.startSystem(Phaser.Physics.P2JS);
		this._game.physics.p2.setImpactEvents(true);

		//bounciness
		this._game.physics.p2.restitution = 0.7;
		this._gameSubject.asteroidCollisionGroup = this._game.physics.p2.createCollisionGroup();
		this._gameSubject.playerCollisionGroup = this._game.physics.p2.createCollisionGroup();

		//init player
		let shipSpr = this._game.add.sprite(300, 300, 'ship');
		let fistSpr = this._game.add.sprite(300, 200, 'fist');
		fistSpr.anchor.setTo(0.46, 0.9);
		this._game.physics.p2.enable([shipSpr, fistSpr], this._config.debug);

		this._game.camera.follow(shipSpr);

		shipSpr.body.clearShapes();
		shipSpr.body.loadPolygon('sprite_physics', 'ship');
		fistSpr.body.clearShapes();
		fistSpr.body.loadPolygon('sprite_physics', 'fist');

		shipSpr.body.setCollisionGroup(this._gameSubject.playerCollisionGroup);
		shipSpr.body.collides(this._gameSubject.asteroidCollisionGroup);
		fistSpr.body.setCollisionGroup(this._gameSubject.playerCollisionGroup);
		fistSpr.body.collides(this._gameSubject.asteroidCollisionGroup, (body1, body2) => this._gameSubject.dispatch(GameEvent.AsteroidPunch, {body1, body2}));

		let spring = this._game.physics.p2.createSpring(shipSpr, fistSpr, 65, 90, 2);
		let constraint = this._game.physics.p2.createPrismaticConstraint(shipSpr,fistSpr, true,[0,0],[0,0],[0,1]);

		constraint.lowerLimitEnabled = constraint.upperLimitEnabled = true;
		constraint.upperLimit = 20;
		constraint.lowerLimit = 0.1;

		this._gameSubject.player = new PlayerObject(shipSpr, fistSpr);
		

		//init asteroids

		let asteroids = this._game.add.group();
		this._gameSubject.asteroidGroup = asteroids;
		
		asteroids.enableBody = true;
		asteroids.physicsBodyType = Phaser.Physics.P2JS;

		this._gameSubject.asteroids = [];
		for(let i = 0; i < this._config.asteroidNum; i++) {
			let model: Asteroid = Object.assign({}, this._config.asteroidTiers[0]);
			model.currentAsset = Phaser.ArrayUtils.getRandomItem(model.assetPool);

			let asteroidSpr = asteroids.create(Math.random()*this._config.mapWidth, Math.random()*this._config.mapHeight, model.currentAsset);
			asteroidSpr.body.debug = this._config.debug;
			asteroidSpr.anchor.setTo(0.5, 0.5);
			asteroidSpr.body.clearShapes();
			asteroidSpr.body.loadPolygon('sprite_physics', model.currentAsset);
			asteroidSpr.body.setCollisionGroup(this._gameSubject.asteroidCollisionGroup);
			asteroidSpr.body.collides([this._gameSubject.asteroidCollisionGroup, this._gameSubject.playerCollisionGroup]);

			this._gameSubject.asteroids.push(new AsteroidObject(asteroidSpr, model));
		}

		//world bounds collision group
		this._game.physics.p2.updateBoundsCollisionGroup();
	}
	
	render() {
		this._game.debug.text(this._game.time.fps || '--', 2, 14, "#a7aebe");
	}
}