import type { BoxGeometry, Mesh, Vector3 } from "three";
import type { Hud3D } from "@/features/sdk/types/hud";
import type { PBVector3 } from "@/features/sdk/types/packets";
import { MATCHED_DUMPS } from "@/hooks/replacement";
import Interop from "../exposedO";
import type { BlockPos } from "../features/sdk/types/blockpos";
import type { Chat } from "../features/sdk/types/chat";
import type { ClientSocket } from "../features/sdk/types/clientSocket";
import type {
	PlayerController,
	PlayerControllerMP,
} from "../features/sdk/types/controller";
import type {
	ClientEntityPlayer,
	EntityLivingBase,
} from "../features/sdk/types/entity";
import type { Game } from "../features/sdk/types/game";
import type { ItemBlock, ItemSword, Items } from "../features/sdk/types/items";
import type { Materials } from "../features/sdk/types/materials";
import type { EnumFacing } from "../features/sdk/types/math/facing";
import type { ClientWorld } from "../features/sdk/types/world";
import mappings from "./mappings";
import remapObj from "./remapProxy";

// biome-ignore lint/complexity/noStaticOnlyClass: job
class Refs {
	// all of these variables are just for caching.
	static #game?: Game;
	static #world?: ClientWorld;
	static #player?: ClientEntityPlayer;
	static #chat?: Chat;
	static #Vec3?: typeof Vector3;
	static #clientSocket: typeof ClientSocket;
	static #PBVector3: PBVector3;
	static #BlockPos: typeof BlockPos;
	static #EnumFacing: typeof EnumFacing;
	// TODO: ts like really annoying so uh maybe a better solution?
	static #EntityLivingBase: typeof EntityLivingBase;
	// for PlayerController, use `game.controller`
	static #playerController: PlayerController;
	static #playerControllerMP: PlayerControllerMP;
	static #BoxGeometry: typeof BoxGeometry;
	static #Mesh: typeof Mesh;
	static #Materials: typeof Materials;
	static #Items: typeof Items;
	static #ItemBlock: typeof ItemBlock;
	static #ItemSword: typeof ItemSword;
	static #hud3D: Hud3D;

	static #initOrR<T>(field: T, initializer: () => T) {
		field ??= initializer();
		return field;
	}

	static get ItemSword(): typeof ItemSword {
		return Refs.#initOrR(Refs.#ItemSword, () =>
			Interop.run((e) => e<typeof ItemSword>("ItemSword")),
		);
	}

	static get Materials() {
		return Refs.#initOrR(Refs.#Materials, () =>
			Interop.run((e) => e<typeof Materials>("Materials")),
		);
	}

	static get Items() {
		return Refs.#initOrR(Refs.#Items, () =>
			Interop.run((e) => e<typeof Items>("Items")),
		);
	}
	static get ItemBlock() {
		return Refs.#initOrR(Refs.#ItemBlock, () =>
			Interop.run((e) => e<typeof ItemBlock>("ItemBlock")),
		);
	}
	static get hud3D() {
		return Refs.#initOrR(Refs.#hud3D, () =>
			Interop.run((e) => e<Hud3D>("hud3D")),
		);
	}

	/**
	 * Just `game.controller` with the remap proxy applied
	 */
	static get playerController() {
		return Refs.#initOrR(Refs.#playerController, () =>
			remapObj(Refs.game.controller, mappings.playerController),
		);
	}

	static get playerControllerMP() {
		return Refs.#initOrR(Refs.#playerControllerMP, () =>
			remapObj(
				Interop.run((e) => e<PlayerControllerMP>("playerControllerMP")),
				mappings.playerControllerMP,
			),
		);
	}

	static get BoxGeometry() {
		return Refs.#initOrR(Refs.#BoxGeometry, () =>
			Interop.run((e) =>
				e<typeof BoxGeometry>(MATCHED_DUMPS.boxGeometry),
			),
		);
	}

	static get Mesh() {
		return Refs.#initOrR(Refs.#Mesh, () =>
			Interop.run((e) => e<typeof Mesh>("Mesh")),
		);
	}

	static get Vec3() {
		return Refs.#initOrR(Refs.#Vec3, () =>
			Interop.run((e) => e<typeof Vector3>("Vector3$1")),
		);
	}

	static get BlockPos() {
		return Refs.#initOrR(Refs.#BlockPos, () =>
			Interop.run((e) => e<typeof BlockPos>("BlockPos")),
		);
	}

	static get EnumFacing() {
		return Refs.#initOrR(Refs.#EnumFacing, () =>
			Interop.run((e) => e<typeof EnumFacing>("EnumFacing")),
		);
	}

	static get EntityLivingBase() {
		return Refs.#initOrR(Refs.#EntityLivingBase, () =>
			Interop.run((e) => e<typeof EntityLivingBase>("EntityLivingBase")),
		);
	}

	static get PBVector3() {
		return Refs.#initOrR(Refs.#PBVector3, () =>
			Interop.run((e) => e<PBVector3>("PBVector3")),
		);
	}

	/**
	 * Prefer using some of the getters in here instead of from this game object,
	 * since some of them have a remapper proxy added, which automatically remaps non-obfuscated symbol names to their dumped version,
	 * which you would have to do manually by indexing dumps and casting to `as "originalName"` so you get the typings.
	 * | Old name             | New name              | Auto remapping |
	 * |----------------------|-----------------------|----------------:|
	 * | Refs.game.player     | Refs.player           | ✅             |
	 * | Refs.game.world      | Refs.world            | ✅             |
	 * | Refs.game.controller | Refs.playerController | ✅             |
	 * | Refs.game.chat       | Refs.chat             | Not needed     |
	 */
	static get game() {
		return Refs.#initOrR(Refs.#game, () => Interop.run((e) => e("game")));
	}

	static get ClientSocket(): typeof ClientSocket {
		return Refs.#initOrR(Refs.#clientSocket, () =>
			Interop.run((e) => e("ClientSocket")),
		);
	}

	/** Refs.game.world with a remap proxy applied */
	static get world() {
		return Refs.#initOrR(Refs.#world, () =>
			remapObj(Refs.game.world, mappings.world),
		);
	}

	/** Convenience reference to Refs.game.chat */
	static get chat() {
		return Refs.#initOrR(Refs.#chat, () => Refs.game.chat);
	}

	/** Refs.game.player with a remap proxy applied */
	static get player() {
		return Refs.#initOrR(Refs.#player, () =>
			remapObj(Refs.game.player, mappings.ClientEntityPlayer),
		);
	}
}

export default Refs;
