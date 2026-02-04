// Client-side classes extracted from Impact
import type { SPacketMessage, SPacketUseEntity, SPacketPlayerInput } from "./packets";

export declare class ClientSocket {
	static sendPacket(packet: any): void;
	static on(event: string, callback: (data: any) => void): void;
}

export declare class Game {
	static isActive(checkPointerLock?: boolean): boolean;
	canvas: HTMLCanvasElement;
	inGame(): boolean;
	connect(server: string): void;
	requestQueue(): void;
	chat: ChatManager;
	world: any;
	info: GameInfo;
	serverInfo: ServerInfo;
	playerList: PlayerList;
	resourceMonitor: ResourceMonitor;
	gameScene: GameScene;
	tickLoop?: number;
	fixedUpdate(): void;
}

export interface ChatManager {
	showInput: boolean;
	addChat(message: { text: string; color?: string }): void;
}

export interface GameInfo {
	selectedSlot: number;
	showSignEditor: any;
}

export interface ServerInfo {
	serverCategory: string;
}

export interface PlayerList {
	playerDataMap: Map<number, PlayerData>;
}

export interface PlayerData {
	color: string;
}

export interface ResourceMonitor {
	filteredFPS: number;
	filteredPing: number;
}

export interface GameScene {
	ambientMeshes: any;
}

export declare const game: Game;
export declare const player: any;
export declare const controls: any;
