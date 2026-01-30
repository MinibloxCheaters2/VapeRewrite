import { Vector3 } from "three";
import { BlockPos } from "./blockpos";
import { Entity, EntityLivingBase, EntityPlayer } from "./entity";
import { PBItemStack, SPacketEnchantItem } from "./packets";
import World from "./world";
import { Item } from "./undefined";

export declare class PlayerControllerMP {
	lastSentSlot: number;
	isHittingBlock: boolean;
	/** IMPORTANT: USE DUMPS */
	syncItem(): void;
	func_181040_m(): this["isHittingBlock"];
	sendEnchantPacket(windowId: string, button: number): void;
}

export declare class PlayerController {
	prevBlock: undefined;
	lastBreakSoundPlay: number;
	key: {
		leftClick: number;
	};
	rightClick: boolean;
	objectMouseOver: RayTraceResult;
	rightClickDelayTimer: number;
	currBreakingLocation: any;
	reset(): void;
	getBlockReachDistance(): 5 | 4.5;
	leftClick(u: boolean): void;
	middleClick(u: boolean): void;
	rightClickMouse(): void;
	onPlayerRightClick(
		e: EntityPlayer,
		world: World,
		item: Item,
		pos: Vector3,
		placeSide: any,
		hitVec: Vector3,
	): any;
	sendUseItem(plr: EntityLivingBase, h: any, p: any): boolean;
	/** **IMPORTANT**: USE DUMPS */
	windowClick(
		windowID: number,
		slotID: number,
		button: number,
		mode: number,
		player: EntityPlayer,
	): any;
	onStoppedUsingItem(u: any): void;
	select(): void;
	punch(): boolean | undefined;
	attackEntity(e: Entity): void;
	interactWithEntitySendPacket(u: any, h: any): boolean;
	findHotbarSlotForPickBlock(u: PBItemStack): number;
	getTargetedBlockCoords(): BlockPos;
	getTargetedBlockState(): BlockState;
	getScreenLookVector(): unknown;
	updateMouseOver(): void;
	pickBlock(): void;
	mine(u?: unknown): void;
	dropItem(u?: boolean): void;
	update(): void;
	render(): void;
}
