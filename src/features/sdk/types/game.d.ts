import { Vector3 } from "three";
import { ClientEntityPlayer } from "./entity";
import { PlayerController } from "./controller";
import { GameScene } from "./gameScene";
import { ClientWorld } from "./world";
import { Chat } from "./chat";
import { ServerInfo } from "./serverInfo";

export enum GameState {
	TITLE_SCREEN = 0,
	CONNECTING = 1,
	CONNECTING_ATTEMPT = 2,
	CONNECTION_ERROR = 3,
	AUTHENTICATING = 4,
	LOADING_CHUNKS = 5,
	PLAY = 6,
}

export interface GameInfo {
	selectedSlot: number;
	showSignEditor: Vector3 | null;
	showDeathScreen?: boolean;
}

export declare class ResourceMonitor {
	instantFPS: number;
	filteredFPS: number;
	/** note: this is always 0 */
	instantPing: number;
	filteredPing: number;
	static fpsGraphUpdate: unknown | null;
	static memoryGraphUpdate: unknown | null;
	static tickTimeGraphUpdate: unknown | null;
}

export declare class Game {
	player: ClientEntityPlayer;
	controller: PlayerController;
	gameScene: GameScene;
	world: ClientWorld;
	playerList: PlayerList;
	unleash;
	cubicBezier: CubicBezier;
	chunkRenderManager: ChunkRenderManager;
	chunkManager: ClientChunkManager;
	prevTime: number;
	lastFixedUpdate: number;
	renderLoopErrored: boolean;
	chat: Chat;
	resourceMonitor: ResourceMonitor;
	info: GameInfo;
	adIntervalId: number | null;
	connectionAttempts: number;
	_state: GameState;
	party: PartyClient;
	scoreboardLines: string[];
	scoreboardTitle: string;
	delta: number;
	serverInfo: ServerInfo;
	constructor();
	static get isCrazyGames(): boolean;
	static get isDiscordActivity(): boolean;
	static get isPoki(): boolean;
	get state(): this["_state"];
	set state(value: GameState);
	inGame(): boolean;
	gameLoopStarted(): boolean;
	/**
	 * @param f1 does being in f1 mode count as activity?
	 */
	static isActive(f1?: boolean): boolean;
	static isChatting(): Game["chat"]["showInput"];
	static hasMenuOpen(): boolean;
	init(): Promise<void>;
	fixedUpdateTS(): void;
	update(): void;
	fixedUpdate(): void;
	requestQueue(): void;
	/**
	 * Queues for a mini game.
	 * @param miniGameID the ID of the mini game to queue
	 * @param mgConfig the config of the mini game
	 */
	queue(miniGameID: string, mgConfig: object): Promise<void>;
	connectWithCode(code: string): void;
	tryUpdateClient(serverID: string): void;
	connect(idOrCustomURL: string, useCustomURL?: boolean, noAd?: boolean): Promise<void>;
	disconnect(reason: string): void;
	onSocketDisconnect(reason: string | null): void;
	static isFullscreen(): boolean;
	static enterFullscreen(): void;
	unfocus(): void;
	resume(): void;
	pause(): void;
	loadPlanet(
		id: number,
		accessControl: string,
		callback: (justStarted: boolean) => void,
	): void;
}
