import type { Vector3 } from "three";
import Interop from "../exposedO";
import type { BlockPos } from "../features/sdk/types/blockpos";
import type { ClientSocket } from "../features/sdk/types/clientSocket";
import type { PlayerControllerMP } from "../features/sdk/types/controller";
import type {
	ClientEntityPlayer,
	EntityLivingBase,
} from "../features/sdk/types/entity";
import type { Game } from "../features/sdk/types/game";
import type { EnumFacing } from "../features/sdk/types/math/facing";
import type { PBVector3 } from "../features/sdk/types/packets";
import type { ClientWorld } from "../features/sdk/types/world";

// biome-ignore lint/complexity/noStaticOnlyClass: job
class Refs {
	// all of these variables are just for caching.
	static #game?: Game;
	static #world?: ClientWorld;
	static #player?: ClientEntityPlayer;
	static #Vec3?: typeof Vector3;
	static #clientSocket: typeof ClientSocket;
	static #PBVector3: typeof PBVector3;
	static #BlockPos: typeof BlockPos;
	static #EnumFacing: typeof EnumFacing;
	// TODO: ts like really annoying so uh maybe a better solution?
	static #EntityLivingBase: typeof EntityLivingBase;
	// for PlayerController, use `game.controller`
	static #playerControllerMP: PlayerControllerMP;

	static #initOrR<T>(field: T, initializer: () => T) {
		field ??= initializer();
		return field;
	}

	static get playerControllerMP() {
		return Refs.#initOrR(Refs.#playerControllerMP, () =>
			Interop.run((e) => e<PlayerControllerMP>("playerControllerMP")),
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
			Interop.run((e) => e("PBVector3")),
		);
	}

	static get game() {
		// this.#game ??= runOnBridge(e => e<Game>("game"));
		// return this.#game;
		return Refs.#initOrR(Refs.#game, () => Interop.run((e) => e("game")));
	}

	static get ClientSocket(): typeof ClientSocket {
		return Refs.#initOrR(Refs.#clientSocket, () =>
			Interop.run((e) => e("ClientSocket")),
		);
	}

	static get world() {
		// this.#world ??= runOnBridge(e => e<ClientWorld>("world"));
		// return this.#world;
		return Refs.#initOrR(Refs.#world, () =>
			Interop.run((e) => e<ClientWorld>("world")),
		);
	}

	static get player() {
		// this.#player ??= runOnBridge(e => e<ClientEntityPlayer>("player"));
		// return this.#player;
		return Refs.#initOrR(Refs.#player, () =>
			Interop.run((e) => e<ClientEntityPlayer>("player")),
		);
	}
}

export default Refs;
