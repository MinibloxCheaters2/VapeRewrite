// Packet type definitions extracted from Impact
import type { BlockPos, PBBlockPos } from "./blockpos";
import type { Vector3 } from "three";

export interface PBVector3 {
	x: number;
	y: number;
	z: number;
}

export interface PBItemStack {
	item: string;
	count: number;
	damage: number;
	tag?: string;
}

export enum PBAction {
	START_DESTROY_BLOCK = 0,
	ABORT_DESTROY_BLOCK = 1,
	STOP_DESTROY_BLOCK = 2,
	DROP_ALL_ITEMS = 3,
	DROP_ITEM = 4,
	RELEASE_USE_ITEM = 5,
	SWAP_HELD_ITEMS = 6,
}

// Server-bound packets (SPacket)
export declare class SPacketPlayerInput {
	sequenceNumber: number;
	pos: PBVector3;
	yaw?: number;
	pitch?: number;
	onGround?: boolean;
	moveForward?: number;
	moveStrafe?: number;
	jumping?: boolean;
	sneaking?: boolean;
	sprinting?: boolean;
	constructor(data: {
		sequenceNumber: number;
		pos: PBVector3;
		yaw?: number;
		pitch?: number;
		onGround?: boolean;
		moveForward?: number;
		moveStrafe?: number;
		jumping?: boolean;
		sneaking?: boolean;
		sprinting?: boolean;
	});
}

export declare class SPacketPlayerPosLook {
	pos: PBVector3;
	yaw?: number;
	pitch?: number;
	onGround: boolean;
	constructor(data: {
		pos: PBVector3;
		yaw?: number;
		pitch?: number;
		onGround: boolean;
	});
}

export declare class SPacketUseEntity {
	id: number;
	action: number;
	hitVec?: PBVector3;
	constructor(data: { id: number; action: number; hitVec?: PBVector3 });
}

export declare class SPacketUseItem {
	constructor();
}

export declare class SPacketPlayerAction {
	position: PBBlockPos;
	facing: number;
	action: PBAction;
	constructor(data: {
		position: PBBlockPos;
		facing: number;
		action: PBAction;
	});
}

export declare class SPacketMessage {
	text: string;
	constructor(data: { text: string });
}

export declare class SPacketCraftItem {
	data: string;
	constructor(data: { data: string });
}

export declare class SPacketRespawn {
	constructor();
}

export declare class SPacketRespawn$1 extends SPacketRespawn {}

export declare class SPacketOpenShop {
	constructor(data: {});
}

export declare class SPacketBreakBlock {
	position: PBBlockPos;
	constructor(data: { position: PBBlockPos });
}

export declare class SPacketEnchantItem {
	windowId: string;
	button: number;
	constructor(data: { windowId: string; button: number });
}

// Client-bound packets (CPacket)
export declare class CPacketMessage {
	text: string;
	id?: string;
	color?: string;
}

export declare class CPacketPlayerReconciliation {
	x: number;
	y: number;
	z: number;
	reset?: boolean;
}

export declare class CPacketRespawn {
	dimension?: string;
}

export declare class CPacketLeaderboard {
	id: string;
	entries: Array<{ name: string; value: number }>;
}

export declare class CPacketEntityVelocity {
	id: number;
	motion: Vector3;
}

export declare class CPacketExplosion {
	playerPos?: Vector3;
	x: number;
	y: number;
	z: number;
	strength: number;
}

export declare class CPacketUpdateStatus {
	rank?: string;
}

export declare class CPacketDisconnect {
	reason: string;
}
