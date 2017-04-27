import * as Phaser from 'phaser'
import {BaseSubject} from "../base";
import {injectable} from "inversify";

@injectable()
export class GameSubject extends BaseSubject {
	constructor() {
		super();
	}
}