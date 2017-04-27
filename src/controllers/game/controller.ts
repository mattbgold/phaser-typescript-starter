import * as Phaser from 'phaser'
import {injectable} from "inversify";
import Game = Phaser.Game;
import Signal = Phaser.Signal;
import {BaseController} from "../base";

@injectable()
export class GameController extends BaseController {
	constructor(
		private _game: Game) {
		super();
	}

	preload() {
	}
	
	create() {
		this._game.stage.backgroundColor = '#aaccff';
	}
	
	render() {
		this._game.debug.text(this._game.time.fps || '--', 2, 14, "#a7aebe");
	}
}