export interface GameConfig {
	keyConfig: {[key:string]: string}
}

export abstract class GameStates {
	static BOOT: string = 'boot';
	static PRELOAD: string = 'preload';
	static TITLE: string = 'title';
	static GAME: string = 'game';
}

export function getConfig(): GameConfig {
	return {
		keyConfig: {
			KeyUp: 'W',
			KeyLeft: 'A',
			KeyRight: 'D',
			KeyDown: 'S'
		}
	};
}