import { Entity } from "./entity";

export default class World {
	/** IMPORTANT: USE DUMPS */
	entities: Map<number, Entity>;
	get isClient(): boolean;
	get isServer(): boolean;
}

export declare class ClientWorld extends World {}
