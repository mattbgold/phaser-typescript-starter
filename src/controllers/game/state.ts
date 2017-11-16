import * as Phaser from 'phaser';
import State = Phaser.State;
import {BaseController} from "../base";
import Game = Phaser.Game;
import {GameSubject, GameEvent} from "../../services/subject/game";

export class GameState extends Phaser.State {
	private _mapToLoad: string;
	
	constructor(
		private _game: Game, 
		private _controllers: BaseController[],
	    private _gameSubject: GameSubject
	) {
		super(_game);
	}

	init() {
	}

	preload() {
		//load game assets
		this._controllers.forEach(_ => _.preload());
	}

	create() {
		this._controllers.forEach(_ => _.create());
	}

	update() {
		this._controllers.forEach(_ => _.update());
	}

	render() {
		this._controllers.forEach(_ => _.render());
	}
}