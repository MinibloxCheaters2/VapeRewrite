import type { BoxGeometry, Mesh, Vector3 } from "three";
import Interop from "@/exposedO";
import type { BlockPos } from "@/features/sdk/types/blockpos";
import type { AllBlocks } from "@/features/sdk/types/blocks";
import type { Chat } from "@/features/sdk/types/chat";
import type { ClientSocket } from "@/features/sdk/types/clientSocket";
import type {
	PlayerController,
	PlayerControllerMP,
} from "@/features/sdk/types/controller";
import type {
	ClientEntityPlayer,
	EntityLivingBase,
} from "@/features/sdk/types/entity";
import type { Game } from "@/features/sdk/types/game";
import type { Hud3D } from "@/features/sdk/types/hud";
import type { ItemBlock, ItemSword, Items } from "@/features/sdk/types/items";
import type { Materials } from "@/features/sdk/types/materials";
import type { EnumFacing } from "@/features/sdk/types/math/facing";
import type { PBVector3 } from "@/features/sdk/types/packets";
import type { ClientWorld } from "@/features/sdk/types/world";
import { MATCHED_DUMPS } from "@/hooks/replacement";
import mappings from "../mapping/mappings";
import initOrR from "./initOrR";
import remapObj from "./remapProxy";

function uninitialized<T>(): T {
	return undefined as unknown as T;
}

const game = uninitialized<Game>();
const world = uninitialized<ClientWorld>();
const player = uninitialized<ClientEntityPlayer>();
const chat = uninitialized<Chat>();
const Vec3 = uninitialized<typeof Vector3>();
const clientSocket = uninitialized<typeof ClientSocket>();
const cachedPBVector3 = uninitialized<PBVector3>();
const cachedBlockPos = uninitialized<typeof BlockPos>();
const cachedEnumFacing = uninitialized<typeof EnumFacing>();
const cachedEntityLivingBase = uninitialized<typeof EntityLivingBase>();
const playerController = uninitialized<PlayerController>();
const playerControllerMP = uninitialized<PlayerControllerMP>();
const cachedBoxGeometry = uninitialized<typeof BoxGeometry>();
const cachedMesh = uninitialized<typeof Mesh>();
const cachedMaterials = uninitialized<typeof Materials>();
const cachedItems = uninitialized<typeof Items>();
const cachedItemBlock = uninitialized<typeof ItemBlock>();
const cachedItemSword = uninitialized<typeof ItemSword>();
const hud3D = uninitialized<Hud3D>();
const Blocks = uninitialized<AllBlocks>();

const Refs = {
	get ItemSword(): typeof ItemSword {
		return initOrR(cachedItemSword, () =>
			Interop.run((e) => e<typeof ItemSword>("ItemSword")),
		);
	},

	get Blocks(): AllBlocks {
		return initOrR(
			Blocks,
			() =>
				(globalThis as typeof globalThis & { Blocks: AllBlocks })
					.Blocks,
		);
	},

	get Materials() {
		return initOrR(cachedMaterials, () =>
			Interop.run((e) => e<typeof Materials>("Materials")),
		);
	},

	get Items() {
		return initOrR(cachedItems, () =>
			Interop.run((e) => e<typeof Items>("Items")),
		);
	},
	get ItemBlock() {
		return initOrR(cachedItemBlock, () =>
			Interop.run((e) => e<typeof ItemBlock>("ItemBlock")),
		);
	},
	get hud3D() {
		return initOrR(hud3D, () => Interop.run((e) => e<Hud3D>("hud3D")));
	},

	/**
	 * Just `game.controller` with the remap proxy applied
	 */
	get playerController() {
		return initOrR(playerController, () =>
			remapObj(Refs.game.controller, mappings.playerController),
		);
	},

	get playerControllerMP() {
		return initOrR(playerControllerMP, () =>
			remapObj(
				Interop.run((e) => e<PlayerControllerMP>("playerControllerMP")),
				mappings.playerControllerMP,
			),
		);
	},

	get BoxGeometry() {
		return initOrR(cachedBoxGeometry, () =>
			Interop.run((e) =>
				// biome-ignore lint/style/noNonNullAssertion: this exists, unless the dump doesn't match.
				e<typeof BoxGeometry>(MATCHED_DUMPS.boxGeometry!),
			),
		);
	},

	get Mesh() {
		return initOrR(cachedMesh, () =>
			Interop.run((e) => e<typeof Mesh>("Mesh")),
		);
	},

	get Vec3() {
		return initOrR(Vec3, () =>
			Interop.run((e) => e<typeof Vector3>("Vector3$1")),
		);
	},

	get BlockPos() {
		return initOrR(cachedBlockPos, () =>
			Interop.run((e) => e<typeof BlockPos>("BlockPos")),
		);
	},

	get EnumFacing() {
		return initOrR(cachedEnumFacing, () =>
			Interop.run((e) => e<typeof EnumFacing>("EnumFacing")),
		);
	},

	get EntityLivingBase() {
		return initOrR(cachedEntityLivingBase, () =>
			Interop.run((e) => e<typeof EntityLivingBase>("EntityLivingBase")),
		);
	},

	get PBVector3() {
		return initOrR(cachedPBVector3, () =>
			Interop.run((e) => e<PBVector3>("PBVector3")),
		);
	},

	/**
	 * Prefer using some of the getters in here instead of from this game object,
	 * since some of them have a remapper proxy added, which automatically remaps non-obfuscated symbol names to their dumped version,
	 * which you would have to do manually by indexing dumps and casting to `as "originalName"` so you get the typings.
	 * | `game.` version      | `Refs` version        | Auto remapping |
	 * |----------------------|-----------------------|----------------:|
	 * | Refs.game.player     | Refs.player           | ✅             |
	 * | Refs.game.world      | Refs.world            | ✅             |
	 * | Refs.game.controller | Refs.playerController | ✅             |
	 * | Refs.game.chat       | Refs.chat             | Not needed     |
	 */
	get game() {
		return initOrR(game, () => Interop.run((e) => e("game")));
	},

	get ClientSocket() {
		return initOrR(clientSocket, () =>
			Interop.run((e) => e("ClientSocket")),
		);
	},

	/** Refs.game.world with a remap proxy applied */
	get world() {
		return initOrR(world, () => remapObj(Refs.game.world, mappings.world));
	},

	/** Convenience reference to Refs.game.chat */
	get chat() {
		return initOrR(chat, () => Refs.game.chat);
	},

	/** Refs.game.player with a remap proxy applied */
	get player() {
		return initOrR(player, () =>
			remapObj(Refs.game.player, mappings.ClientEntityPlayer),
		);
	},
};

export default Refs;
