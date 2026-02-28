import type { BlockPos } from "@/features/sdk/types/blockpos";
import type { Block } from "@/features/sdk/types/blocks";
import PacketRefs from "./packetRefs";
import Refs from "./refs";
import { BlockState } from "@/features/sdk/types/world";

export type BlockHandler = (b: BlockPos) => void;
export type BlockFilter = (b: BlockPos) => boolean;

export const blockHandlers = {
	rightClick(pos: BlockPos) {
		Refs.ClientSocket.sendPacket(
			new PacketRefs.s.SPacketClick({
				location: pos.toProto(),
			}),
		);
	},
	breakBlock(pos: BlockPos) {
		Refs.ClientSocket.sendPacket(
			new PacketRefs.s.SPacketBreakBlock({
				location: pos.toProto(),
				start: false,
			}),
		);
	},
} satisfies { [k: string]: BlockHandler };

// function isAir(b: Block) {
// 	return b.material.air;
// }

export function isSolid(b: Block) {
	return b.material.isSolid();
}

export function withBlock<T>(fn: (block: Block) => T): (pos: BlockPos) => T {
	const { world } = Refs;
	return pos => fn(world.getBlock(pos));
}

export function withBlockState<T>(fn: (block: BlockState) => T): (pos: BlockPos) => T {
	const { world } = Refs;
	return pos => fn(world.getBlockState(pos));
}

export const dfltFilter: BlockFilter = (b) => isSolid(Refs.world.getBlock(b));

export function allBlocksInRange(range: number): BlockPos[] {
	const { player, BlockPos } = Refs;
	const min = new BlockPos(
		player.pos.x - range,
		player.pos.y - range,
		player.pos.z - range,
	);
	const max = new BlockPos(
		player.pos.x + range,
		player.pos.y + range,
		player.pos.z + range,
	);
	return BlockPos.getAllInBoxMutable(min, max);
}

export function oneInRange(
	range: number,
	filter: BlockFilter,
): BlockPos | undefined {
	const blocks = allBlocksInRange(range);
	const filtered = blocks.find(filter);
	return filtered;
}

export function allInRange(
	range: number,
	filter?: BlockFilter,
) {
	const blocks = allBlocksInRange(range);
	const filtered =
		filter !== undefined
			? blocks.filter(filter)
			: blocks;
	return filtered;
}

export function handleInRange(
	range: number,
	filter = dfltFilter,
	handler = blockHandlers.rightClick,
) {
	const r = allInRange(range, filter);
	r.forEach(handler);
	return r;
}
