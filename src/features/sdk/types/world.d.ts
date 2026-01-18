import { Entity } from "./entity";

export default class World {
	entities: Map<number, Entity>;
	get isClient(): boolean;
	get isServer(): boolean;
}

export declare class ClientWorld extends World {}
