import type { Vector3 } from "three";
import { Subscribe } from "@/event/api/Bus";
import Interop from "@/exposedO";
import type { BlockPos } from "@/features/sdk/types/blockpos";
import type { EnumFacing } from "@/features/sdk/types/math/facing";
import { MATCHED_DUMPS } from "@/hooks/replacement";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Scaffold extends Mod {
	public name = "Scaffold";
	public category = Category.BLATANT;

	// Settings
	private towerSetting = this.createToggleSetting("Tower", true);
	private expandSetting = this.createSliderSetting("Expand", 1, 0, 5, 0.5);
	private cycleSetting = this.createSliderSetting(
		"Cycle Speed",
		10,
		0,
		20,
		1,
	);
	private placesPerTickSetting = this.createSliderSetting(
		"Places Per Tick",
		10,
		0,
		20,
		1,
	);
	private sameYSetting = this.createToggleSetting("Same Y", false);

	// State
	private oldHeldSlot?: number;
	private tickCount = 0;
	private lastScaffoldY: number | null = null;

	get tower() {
		return this.towerSetting.value();
	}

	get expand() {
		return this.expandSetting.value();
	}

	get cycleSpeed() {
		return this.cycleSetting.value();
	}

	get placesPerTick() {
		return this.placesPerTickSetting.value();
	}

	get sameY() {
		return this.sameYSetting.value();
	}

	protected onEnable(): void {
		const { player, game } = Refs;
		if (player && game) {
			this.oldHeldSlot = game.info.selectedSlot;
		}
		this.tickCount = 0;
		this.lastScaffoldY = null;
	}

	protected onDisable(): void {
		const { player, game } = Refs;
		if (player && game && this.oldHeldSlot !== undefined) {
			this.switchSlot(this.oldHeldSlot);
		}
		this.lastScaffoldY = null;
	}

	private switchSlot(slot: number): void {
		const { player, game } = Refs;
		if (!player || !game) return;
		player.inventory.currentItem = slot;
		game.info.selectedSlot = slot;
	}

	private findBlockSlots(): number[] {
		const { player, ItemBlock } = Refs;
		if (!player) return [];

		const slotsWithBlocks: number[] = [];

		for (let i = 0; i < 9; i++) {
			const item = player.inventory.main[i];
			if (
				item &&
				item.item instanceof ItemBlock &&
				item.item.block?.getBoundingBox &&
				item.item.block.getBoundingBox().max.y === 1 &&
				item.item.name !== "tnt"
			) {
				slotsWithBlocks.push(i);
			}
		}
		return slotsWithBlocks;
	}

	private getPossibleSides(pos: BlockPos): EnumFacing | null {
		const { EnumFacing, game, Materials } = Refs;
		if (!EnumFacing || !game || !Materials) return null;

		for (const side of EnumFacing.VALUES) {
			const offset = side.toVector();
			const { BlockPos } = Refs;
			const checkPos = new BlockPos(
				pos.x + offset.x,
				pos.y + offset.y,
				pos.z + offset.z,
			);
			const state = game.world.getBlockState(checkPos);
			if (state.getBlock().material !== Materials.air) {
				return side.getOpposite();
			}
		}
		return null;
	}

	private getRandomHitVec(placePos: BlockPos, face: EnumFacing): Vector3 {
		const { Vec3, EnumFacing } = Refs;
		const rand = () => 0.2 + Math.random() * 0.6;
		let hitX = placePos.x + 0.5;
		let hitY = placePos.y + 0.5;
		let hitZ = placePos.z + 0.5;

		const { name: axis } = face.getAxis();

		if (axis === "y") {
			hitX = placePos.x + rand();
			hitY = placePos.y + (face === EnumFacing.UP ? 0.99 : 0.01);
			hitZ = placePos.z + rand();
		} else if (axis === "x") {
			hitX = placePos.x + (face === EnumFacing.EAST ? 0.99 : 0.01);
			hitY = placePos.y + rand();
			hitZ = placePos.z + rand();
		} else {
			hitX = placePos.x + rand();
			hitY = placePos.y + rand();
			hitZ = placePos.z + (face === EnumFacing.SOUTH ? 0.99 : 0.01);
		}

		return new Vec3(hitX, hitY, hitZ);
	}

	@Subscribe("gameTick")
	onTick(): void {
		const {
			player,
			game,
			BlockPos,
			ItemBlock,
			playerControllerMP,
			playerController,
		} = Refs;

		if (
			!player ||
			!game ||
			!BlockPos ||
			!playerControllerMP ||
			!playerController
		) {
			return;
		}

		this.tickCount++;

		// Auto-select blocks & cycle
		const blockSlots = this.findBlockSlots();
		if (blockSlots.length === 0) return;

		if (blockSlots.length >= 2 && this.cycleSpeed > 0) {
			const selected =
				Math.floor(this.tickCount / this.cycleSpeed) %
				blockSlots.length;
			this.switchSlot(blockSlots[selected]);
		} else {
			this.switchSlot(blockSlots[0]);
		}

		const item = player.inventory.getCurrentItem();
		if (!item || !(item.getItem() instanceof ItemBlock)) return;

		// Get key pressed function
		const keyPressedDump = MATCHED_DUMPS.keyPressedPlayer;
		const keyPressed: ((key: string) => boolean) | null = keyPressedDump
			? Interop.run((e) => e(keyPressedDump))
			: null;

		// Check if player is moving
		const moveForwardDump = MATCHED_DUMPS.moveForward as "moveForward";
		const moveStrafeDump = MATCHED_DUMPS.moveStrafe as "moveStrafe";
		const isMoving =
			player[moveForwardDump] !== 0 || player[moveStrafeDump] !== 0;

		// Calculate positions
		const playerX = Math.floor(player.pos.x);
		const playerY = Math.floor(player.pos.y);
		const playerZ = Math.floor(player.pos.z);

		// Determine target Y coordinate based on sameY mode
		let targetY: number;
		if (this.sameY) {
			if (isMoving) {
				if (this.lastScaffoldY === null) {
					this.lastScaffoldY = playerY - 1;
				}
				targetY = this.lastScaffoldY;
			} else {
				targetY = playerY - 1;
				this.lastScaffoldY = targetY;
			}
		} else {
			if (this.lastScaffoldY === playerY - 1) {
				targetY = playerY + 2;
			} else {
				targetY = playerY - 1;
			}
			this.lastScaffoldY = targetY;
		}

		// Predict future position
		const predictionMultiplier = this.expand * 2;
		const futureX = player.pos.x + player.motion.x * predictionMultiplier;
		const futureZ = player.pos.z + player.motion.z * predictionMultiplier;
		const flooredFutureX = Math.floor(futureX);
		const flooredFutureZ = Math.floor(futureZ);

		// Check positions
		const positionsToCheck = [
			new BlockPos(flooredFutureX, targetY, flooredFutureZ),
			new BlockPos(playerX, targetY, playerZ),
		];

		// Add diagonal positions for fast strafing
		if (
			Math.abs(player.motion.x) > 0.1 ||
			Math.abs(player.motion.z) > 0.1
		) {
			positionsToCheck.push(
				new BlockPos(flooredFutureX, targetY, playerZ),
				new BlockPos(playerX, targetY, flooredFutureZ),
			);
		}

		const { Materials, hud3D } = Refs;
		let places = 0;

		for (const pos of positionsToCheck) {
			const blockAtPos = game.world.getBlockState(pos).getBlock();

			// Skip if not air
			if (!Materials || blockAtPos.material !== Materials.air) continue;

			// Find a side to place on
			let placeSide = this.getPossibleSides(pos);

			// If no direct side, search nearby
			if (!placeSide) {
				let found = false;
				for (let dist = 1; dist <= 2 && !found; dist++) {
					for (let x = -dist; x <= dist && !found; x++) {
						for (let z = -dist; z <= dist && !found; z++) {
							if (x === 0 && z === 0) continue;
							const searchPos = new BlockPos(
								pos.x + x,
								pos.y,
								pos.z + z,
							);
							const side = this.getPossibleSides(searchPos);
							if (side) {
								placeSide = side;
								found = true;
								// break;
							}
						}
					}
				}
			}

			if (!placeSide) {
				continue;
			}

			// Calculate place position
			const dir = placeSide.getOpposite().toVector();
			const placePos = new BlockPos(
				pos.x + dir.x,
				pos.y + dir.y,
				pos.z + dir.z,
			);

			// Calculate hit vector
			const hitVec = this.getRandomHitVec(placePos, placeSide);

			// Tower mode
			if (this.tower && keyPressed?.("space") && player.onGround) {
				const centerDist = Math.sqrt(
					(player.pos.x - (playerX + 0.5)) ** 2 +
						(player.pos.z - (playerZ + 0.5)) ** 2,
				);

				if (
					centerDist < 0.3 &&
					player.motion.y < 0.2 &&
					player.motion.y >= 0
				) {
					player.motion.y = 0.42;
				}
			}

			// Try to place block
			if (
				playerController.onPlayerRightClick(
					player,
					game.world,
					item,
					placePos,
					placeSide,
					hitVec,
				)
			) {
				hud3D.swingArm?.();

				// Handle item stack
				if (item.stackSize === 0) {
					player.inventory.main[player.inventory.currentItem] = null;
				}
			}

			if (places++ > this.placesPerTick) break; // Only place one block per tick
		}
	}
}
