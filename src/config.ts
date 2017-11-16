import {Asteroid} from "./models/asteroid";
export interface GameConfig {
	keyConfig: {[key:string]: string[]},
	asteroidNum: number,
	mapWidth: number,
	mapHeight: number,
	debug: boolean,
	asteroidTiers: Asteroid[]
}

export abstract class GameStates {
	static BOOT: string = 'boot';
	static PRELOAD: string = 'preload';
	static TITLE: string = 'title';
	static GAME: string = 'game';
}

export function getConfig(): GameConfig {
	return {
		debug: false,
		keyConfig: {
			Up: ['W', 'UP'],
			Left: ['A', 'LEFT'],
			Right: ['D', 'RIGHT'],
			Down: ['S', 'DOWN'],
			Punch: ['SPACEBAR', 'P']
		},
		mapWidth: 1920,
		mapHeight: 1280,
		asteroidNum: 9,
		asteroidTiers: [{
			tier: 0,
			mass: 3,
			forceToDamage: 140,
			forceToDestroy: 100,
			assetPool: ['roid-oval', 'roid-long', 'roid-round']
		}, {
			tier: 1,
			mass: .8,
			forceToDestroy: 150,
			assetPool: ['roid-broken-1', 'roid-broken-2', 'roid-broken-3', 'roid-broken-4']
		}, {
			tier: 2,
			mass: 0.25,
			forceToDestroy: 300,
			assetPool: ['roid-broken-tiny-1', 'roid-broken-tiny-2']
		}]
	};
}