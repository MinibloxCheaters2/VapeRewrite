import type { Vector3 } from "three";
import type { BlockPos } from "./blockpos";
import type { Entity, EntityLivingBase, EntityPlayer } from "./entity";
import type { PBItemStack } from "./packets";
import type World from "./world";
import type { ItemStack } from "./items";
import type { BlockState } from "./world";
import type { EnumFacing } from "./math/facing";

export declare class PlayerControllerMP {
	lastSentSlot: number;
	isHittingBlock: boolean;

	/** IMPORTANT: USE DUMPS */
	syncItem(): void;
	func_181040_m(): this["isHittingBlock"];
	sendEnchantPacket(windowId: string, button: number): void;
	leftClick(): void;
	rightClick(): void;
}

export declare class PlayerController {
	prevBlock: undefined;
	lastBreakSoundPlay: number;
	key: {
		leftClick: boolean;
		rightClick: boolean;
	};
	rightClick: boolean;
	objectMouseOver: RayTraceResult;
	rightClickDelayTimer: number;
	currBreakingLocation: BlockPos;
	reset(): void;
	getBlockReachDistance(): 5 | 4.5;
	leftClick(u: boolean): void;
	middleClick(u: boolean): void;
	rightClickMouse(): void;
	onPlayerRightClick(
		e: EntityPlayer,
		world: World,
		item: ItemStack,
		pos: Vector3 | BlockPos,
		placeSide: EnumFacing,
		hitVec: Vector3,
	): boolean;
	// TODO: item or item stack?
	sendUseItem(plr: EntityLivingBase, world: World, item: ItemStack): boolean;
	/** **IMPORTANT**: USE DUMPS */
	windowClick(
		windowID: number,
		slotID: number,
		button: number,
		mode: number,
		player: EntityPlayer,
	): ItemStack;
	/** @param entity the entity that was using the item */
	onStoppedUsingItem(entity: EntityPlayer): void;
	select(): void;
	punch(): boolean | undefined;
	attackEntity(e: Entity): void;
	interactWithEntitySendPacket(
		_unusedPlayer: unknown,
		entity: Entity,
	): boolean;
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
