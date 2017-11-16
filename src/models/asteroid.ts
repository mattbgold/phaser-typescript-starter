export interface Asteroid {
	mass: number;
	forceToDamage?: number;
	forceToDestroy: number;
	tier: number;
	assetPool: string[];

	currentAsset?:string;
}