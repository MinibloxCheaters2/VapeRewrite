import { C2SPacket } from "./packetTypes";
import type { Socket } from "socket.io-client";

export declare interface EventMap {
	disconnect: string;
	CPacketAnimation: CPacketAnimation;
	CPacketBlockAction: CPacketBlockAction;
	CPacketBlockUpdate: CPacketBlockUpdate;
	CPacketChangeServers: CPacketChangeServers;
	CPacketChunkData: CPacketChunkData;
	CPacketCloseWindow: CPacketCloseWindow;
	CPacketConfirmTransaction: CPacketConfirmTransaction;
	CPacketDestroyEntities: CPacketDestroyEntities;
	CPacketDisconnect: CPacketDisconnect;
	CPacketEntityAction: CPacketEntityAction;
	CPacketEntityEquipment: CPacketEntityEquipment;
	CPacketEntityMetadata: CPacketEntityMetadata;
	CPacketEntityPositionAndRotation: CPacketEntityPositionAndRotation;
	CPacketEntityRelativePositionAndRotation: CPacketEntityRelativePositionAndRotation;
	CPacketEntityStatus: CPacketEntityStatus;
	CPacketEntityVelocity: CPacketEntityVelocity;
	CPacketExplosion: CPacketExplosion;
	CPacketJoinGame: CPacketJoinGame;
	CPacketLeaderboard: CPacketLeaderboard;
	CPacketLocalStorage: CPacketLocalStorage;
	CPacketMessage: CPacketMessage;
	CPacketOpenWindow: CPacketOpenWindow;
	CPacketParticles: CPacketParticles;
	CPacketPlayerList: CPacketPlayerList;
	CPacketPlayerPosition: CPacketPlayerPosition;
	CPacketPlayerPosLook: CPacketPlayerPosLook;
	CPacketPlayerReconciliation: CPacketPlayerReconciliation;
	CPacketPong: CPacketPong;
	CPacketRespawn: CPacketRespawn;
	CPacketScoreboard: CPacketScoreboard;
	CPacketServerInfo: CPacketServerInfo;
	CPacketSetSlot: CPacketSetSlot;
	CPacketSignEditorOpen: CPacketSignEditorOpen;
	CPacketSoundEffect: CPacketSoundEffect;
	CPacketSpawnEntity: CPacketSpawnEntity;
	CPacketSpawnPlayer: CPacketSpawnPlayer;
	CPacketTabComplete: CPacketTabComplete;
	CPacketTitle: CPacketTitle;
	CPacketUpdate: CPacketUpdate;
	CPacketUpdateHealth: CPacketUpdateHealth;
	CPacketUpdateLeaderboard: CPacketUpdateLeaderboard;
	CPacketUpdateScoreboard: CPacketUpdateScoreboard;
	CPacketUpdateSign: CPacketUpdateSign;
	CPacketUpdateStatus: CPacketUpdateStatus;
	CPacketWindowItems: CPacketWindowItems;
	CPacketWindowProperty: CPacketWindowProperty;
	CPacketUseBed: CPacketUseBed;
	CPacketQueueNext: CPacketQueueNext;
	CPacketSpawnExperienceOrb: CPacketSpawnExperienceOrb;
	CPacketSetExperience: CPacketSetExperience;
	CPacketOpenShop: CPacketOpenShop;
	CPacketShopProperties: CPacketShopProperties;
	CPacketEntityProperties: CPacketEntityProperties;
	CPacketEntityEffect: CPacketEntityEffect;
	CPacketRemoveEntityEffect: CPacketRemoveEntityEffect;
	CPacketUpdateCommandBlock: CPacketUpdateCommandBlock;
	CPacketEntityAttach: CPacketEntityAttach;
	CPacketServerMetadata: CPacketServerMetadata;
	CPacketTimeUpdate: CPacketTimeUpdate;
	ClientBoundCombined: ClientBoundCombined;
	connect: void;
}

export declare class ClientSocket {
	static socket: Socket;
	static disconnectMessage?: string;
	/**
	 * @param url server URI/URL
	 * @param path defaults to `/socket.io`
	 */
	static setUrl(url: string, path?: string): void;
	static connect(): void;
	static disconnect(message: string): void;
	static once<T>(name: T, callback: (data: EventMap[T]) => void): void;
	static on<T>(name: T, callback: (data: EventMap[T]) => void): void;
	static sendPacket(packet: C2SPacket): void;
}
