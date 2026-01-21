import type { Scene } from "three/src/Three.js";
import type { ClientEntityPlayer } from "./entity.d.ts";
import "./packet.d.ts";
import type { ClientWorld } from "./world";
import { Chat } from "./chat.d.ts";

export enum ConnectionState {
	IDK = 0,
	CONNECTING = 1,
	CONNECTING_ATTEMPT = 2,
	CONNECTION_ERROR = 3,
	AUTHENTICATING = 4,
	LOADING_CHUNKS = 5,
	PLAY = 6,
}

export declare class Game {
	player: ClientEntityPlayer;
	controller: PlayerController;
	// tickLoop: number;
	gameScene: Scene;
	world: ClientWorld;
	playerList: PlayerList;
	unleash;
	cubicBezier;
	chunkRenderManager;
	chunkManager;
	prevTime: number;
	lastFixedUpdate: number;
	renderLoopErrored: boolean;
	chat: Chat;
	info: GameInfo;
	adIntervalId: number | null;
	connectionAttempts: number;
	_state: ConnectionState;
	party: PartyClient;
	scoreboardLines: string[];
	scoreboardTitle: string;
	delta: number;
	serverInfo: ServerInfo;
	resourceMonitor;
	get isCrazyGames(): boolean;
	get isDiscordActivity(): boolean;
	get isPoki(): boolean;
	get state(): this["_state"];
	set state(value: ConnectionState);
	init(): Promise<void>;
	fixedUpdate(): void;
	fixedUpdateTS(): void;
	inGame(): boolean;
	gameLoopStarted(): boolean;
	static isActive(b: boolean = true): boolean;
	static isChatting(): boolean;
	static hasMenuOpen(): boolean;
	update(): void;
	requestQueue(): void;
	queue(name: string, config: object): Promise<void>;
	connectWithCode(code: string): void;
	tryUpdateClient(serverIDToReconnectTo: string): void;
	connect(customURL: string, useCustomURL = false, p = false): Promise<void>;
	disconnect(reason?: unknown): Promise<void>;
	onSocketDisconnect(reason?: unknown): void;
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
