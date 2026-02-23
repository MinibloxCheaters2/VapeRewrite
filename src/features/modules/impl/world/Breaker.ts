import { Subscribe } from "@/event/api/Bus";
import type { BlockPos } from "@/features/sdk/types/blockpos";
import type { Block /*, Blocks*/ } from "@/features/sdk/types/blocks";
import { c2s } from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Breaker extends Mod {
	public name = "Breaker";
	public category = Category.WORLD;

	private rangeSetting = this.createSliderSetting("Range", 10, 1, 20, 0.5);
	private notifySetting = this.createToggleSetting("Notify", true);

	private lastBreakTime = 0;
	private breakDelay = 100;

	get range() {
		return this.rangeSetting.value();
	}

	get notify() {
		return this.notifySetting.value();
	}

	private isDragonEgg(block: Block): boolean {
		// block == Blocks.dragon_egg;
		const name = block.name?.toLowerCase() || "";
		return name.includes("dragon") && name.includes("egg");
	}

	private getNearbyBlocks() {
		const { player, BlockPos, game } = Refs;
		if (!player || !BlockPos || !game) return [];

		const range = Math.floor(this.range);
		const playerPos = {
			x: Math.floor(player.pos.x),
			y: Math.floor(player.pos.y),
			z: Math.floor(player.pos.z),
		};

		const blocks = [];

		for (let x = -range; x <= range; x++) {
			for (let y = -range; y <= range; y++) {
				for (let z = -range; z <= range; z++) {
					const pos = new BlockPos(
						playerPos.x + x,
						playerPos.y + y,
						playerPos.z + z,
					);

					const block = game.world.getBlockState(pos).getBlock();

					if (this.isDragonEgg(block)) {
						const dist = Math.hypot(x, y, z);
						blocks.push({ pos, distance: dist });
					}
				}
			}
		}

		return blocks.sort((a, b) => a.distance - b.distance);
	}

	private breakBlock(pos: BlockPos): void {
		const { ClientSocket, EnumFacing } = Refs;
		if (!ClientSocket || !EnumFacing) return;

		ClientSocket.sendPacket(
			new (c2s("SPacketBreakBlock"))({
				position: pos.toProto?.() || pos,
				facing: EnumFacing.UP.getIndex(),
				action: 2,
			}),
		);

		if (this.notify) {
			Refs.chat.addChat({
				text: "[Breaker] Egg broken!",
				color: "green",
			});
		}
	}

	@Subscribe("gameTick")
	public onTick() {
		const now = Date.now();

		if (now - this.lastBreakTime < this.breakDelay) {
			return;
		}

		const blocks = this.getNearbyBlocks();

		if (blocks.length === 0) return;

		this.breakBlock(blocks[0].pos);
		this.lastBreakTime = now;
	}

	public getTag(): string {
		return `${this.range} block${this.range === 1 ? "" : "s"}`;
	}
}
