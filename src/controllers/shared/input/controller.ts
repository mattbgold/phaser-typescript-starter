import * as Phaser from 'phaser';
import {injectable, inject} from "inversify";
import Game = Phaser.Game;
import Signal = Phaser.Signal;
import {BaseController} from "../../base";
import Key = Phaser.Key;
import {InputEvent, InputSubject} from "../../../services/subject/input";
import {GameConfig} from "../../../config";

@injectable()
export class InputController extends BaseController {
	private _keyMap: {[keyName: string]: Key[]};
	
	constructor(
		private _game: Game, 
        private _inputSubject: InputSubject,
	    @inject('config') private _config: GameConfig
	) {
		super();
	}

	create() {
		this._keyMap = {};
		
		Object.keys(this._config.keyConfig).forEach(keyName => this._initKey(keyName));

		let keys: Key[] = this._keyMap['Punch'];
		keys.forEach(key => key.onDown.add(() => this._inputSubject.dispatch(InputEvent.Punch)));
	}

	update() {
		this._inputSubject.downPressed = this._keyMap['Down'].some(key => key.isDown);
		this._inputSubject.upPressed = this._keyMap['Up'].some(key => key.isDown);
		this._inputSubject.leftPressed = this._keyMap['Left'].some(key => key.isDown);
		this._inputSubject.rightPressed = this._keyMap['Right'].some(key => key.isDown);
	}
	
	private _initKey(keyName: string) {
		let keysForEvent = this._config.keyConfig[keyName];
		if(!!keysForEvent) {
			this._keyMap[keyName] = keysForEvent.map(key => this._addKeyToGame(Phaser.Keyboard[key]));
		}
	}
	
	private _addKeyToGame(keyCode: number): Key {
		let key: Key = this._game.input.keyboard.addKey(keyCode);
		this._game.input.keyboard.addKeyCapture([keyCode]);
		
		return key;
	}
}