import * as Phaser from 'phaser'
import {injectable} from "inversify";
import {BaseSubject} from "../base";

@injectable()
export class InputSubject extends BaseSubject {
	constructor() {
		super();
	}
	
	upPressed: boolean;
	downPressed: boolean;
	leftPressed: boolean;
	rightPressed: boolean;
}
