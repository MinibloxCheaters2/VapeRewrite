import type { Vector3 } from "three";
import type { BlockPos } from "./blockpos";
import type { Entity, EntityLivingBase, EntityPlayer } from "./entity";
import type { ItemStack } from "./items";
import type { EnumFacing } from "./math/facing";
import type { PBItemStack } from "./packets";
import type { RayTraceResult } from "./rayTraceResult";
import type SlotActionType from "./slotActionType";
import type World from "./world";
import type { BlockState } from "./world";

export declare class PlayerControllerMP {
	lastSentSlot: number;
	isHittingBlock: boolean;

	/** IMPORTANT: USE DUMPS */
	syncItem(): void;
	/** just returns {@link PlayerControllerMP.isHittingBlock isHittingBlock} */
	func_181040_m(): this["isHittingBlock"];
	sendEnchantPacket(windowId: string, button: number): void;
	leftClick(): void;
	rightClick(): void;
}

export declare class PlayerController {
	prevBlock?: Vector3;
	lastBreakSoundPlay: number;
	/** this being an object with only one entry is literally just a waste of RAM :sob: */
	key: {
		/** set to Date.now() on click in some places,
		 * and then to `0` in {@link PlayerController#leftClick} if `release` is true
		 */
		leftClick: number;
	};
	rightClick: boolean;
	objectMouseOver: RayTraceResult;
	rightClickDelayTimer: number;
	currBreakingLocation: BlockPos | null;
	reset(): void;
	getBlockReachDistance(): 5 | 4.5;
	/**
	 * Called when you left click the mouse.
	 * If `release` (`u`) is truthy, it will set {@link PlayerController.key}.leftClick to `0`
	 */
	leftClick(release?: boolean): void;
	/**
	 * Calls {@link PlayerController.pickBlock} if `Game.isActive()` OR if `assumeActive` is truthy.
	 * @param assumeActive assume the game is active
	 */
	middleClick(assumeActive?: boolean): void;
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
	/**
	 * @param windowID the ID of the window to click in
	 * @param slotID the slot to put the item in
	 * @param button the mouse button that was clicked (i.e. 0 for left, 1 for right, and the slot number if using swap mode)
	 * @param mode the click mode, it is recommended to use enum unless you need custom modes (i.e. for abusing bugs).
	 * @param player
	 */
	windowClick(
		windowID: number,
		slotID: number,
		button: number,
		mode: SlotActionType | number,
		player: EntityPlayer,
	): ItemStack;
	/** @param entity the entity that was using the item */
	onStoppedUsingItem(entity: EntityPlayer): void;
	select(): void;
	punch(): boolean | undefined;
	/**
	 * - Syncs the item slot using {@link PlayerControllerMP.syncItem}
	 * - Sends a {@link SPacketUseEntity} packet with `action` = `1`, `id` = `e.id`,
	 * and the `hitVec` is from the objectMouseOver hitVec.
	 * - calls {@link EntityPlayer.attack player.attack} on the entity.
	 * @param e the entity to attack.
	 */
	attackEntity(e: Entity): void;
	interactWithEntitySendPacket(
		_unusedPlayer: unknown,
		entity: Entity,
	): boolean;

	/**
	 * Tries to find an item slot for the pick block function.
	 * - It first tries to find a slot with an item that is equal to this stack.
	 * - If none of the hotbar slots match, then it just finds an empty hotbar slot to put it in.
	 * - If none are empty, it returns the current item slot.
	 */
	findHotbarSlotForPickBlock(stack: PBItemStack): number;
	getTargetedBlockCoords(): BlockPos;
	getTargetedBlockState(): BlockState;
	getScreenLookVector(): Vector3;
	updateMouseOver(): void;
	pickBlock(): void;
	/**
	 * Mines the block selected from {@link PlayerController.objectMouseOver objectMouseOver} if LMB is down.
	 * @param instantMine if the block selected should be instantly mined.
	 */
	mine(instantMine?: boolean): void;
	/**
	 * Drops the item in hand if:
	 * - The {@link EntityPlayer.getHealth player's health} is > 0
	 * - An {@link EntityPlayer.getActiveItemStack item} is selected (not falsy)
	 * - And the {@link EntityPlayer.getActiveItemStack item} {@link ItemStack.stackSize stack size} is `> 0`
	 *   (not `<= 0`)
	 *
	 * Then, it drops the item by sending a `SPacketPlayerAction` packet with
	 * `action` = `all ? PBAction.DROP_ALL_ITEMS else PBAction.DROP_ITEM`,
	 * `facing` = `EnumFacing.DOWN`, and then `position` = `BlockPos.ORIGIN.toProto()`
	 * @param [all=false] drop the entire stack?
	 */
	dropItem(all: boolean = false): void;
	/**
	 * Updates the right click delay timer.
	 */
	update(): void;
	/**
	 * - Updates {@link PlayerController.objectMouseOver objectMouseOver}
	 * - {@link PlayerController.select Updates the selection box}
	 * - {@link PlayerController.mine Mines} a block if selected and the left mouse button is down
	 */
	render(): void;
}
