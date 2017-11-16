import * as Phaser from 'phaser';
import {BaseController} from "../../base";
import {InputSubject} from "../../../services/subject/input/service";
import Game = Phaser.Game;
import {GameSubject} from "../../../services/subject/game/service";
import {injectable} from "inversify";
import {InputEvent} from "../../../services/subject/input/event";
import {PlayerObject} from "./object";

@injectable()
export class PlayerController extends BaseController {

	private _player: PlayerObject;

	constructor(
		private _game: Game,
		private _gameSubject: GameSubject,
		private _inputSubject: InputSubject) {
		super();
	}


	preload() {
		this._inputSubject.subscribe(InputEvent.Punch, () => this._punch());
	}

	create() {
		this._player = this._gameSubject.player;

		for(var i = 0; i < 14; i++) {
			let segment = this._game.make.sprite(0, 0, 'extender');
			segment.anchor.setTo(0.5, 0.5);
			this._player.spr.addChild(segment);
		}
	}
	
	update() {
		if (this._inputSubject.upPressed) {
			this._player.thrust();
		}

		if (this._inputSubject.downPressed) {
			this._player.reverse();

		}

		if (this._inputSubject.leftPressed) {
			this._player.turnLeft();
		}

		if(this._inputSubject.rightPressed) {
			this._player.turnRight();
		}

		let fistDistance = this._player.getFistDistance();
		let totalSegments = this._player.spr.children.length;

		for(let i = 0; i < totalSegments; i++) {
			let segment = this._player.spr.getChildAt(i);

			let flip = !!(i % 2) ? 1 : -1;

			segment.angle = (45 + fistDistance/(totalSegments/5))*flip;
			segment.y = -35 - ((Math.floor(i/2)*2)/totalSegments)*fistDistance;
			segment.scale.x = flip;
		}

	}

	private _punch() {
		this._gameSubject.player.punch();
	}
}