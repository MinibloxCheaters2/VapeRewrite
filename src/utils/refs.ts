import { Vector3 } from "three";
import { ClientEntityPlayer } from "../features/sdk/types/entity";
import { Game } from "../features/sdk/types/game";
import { ClientWorld } from "../features/sdk/types/world";
import Interop from "../exposedO";
import { ClientSocket } from "../features/sdk/types/clientSocket";

class Refs {
	// all of these variables are just for caching.
	static #game?: Game;
	static #world?: ClientWorld;
	static #player?: ClientEntityPlayer;
	static #Vec3?: typeof Vector3;
	static #clientSocket: typeof ClientSocket;

	static #initOrR<T>(field: T, initializer: () => T) {
		field ??= initializer();
		return field;
	}

	static get Vec3() {
		this.#Vec3 ??= Interop.run(e => e<typeof Vector3>("Vector3$1"));
		return this.#Vec3;
	}

	static get game() {
		// this.#game ??= runOnBridge(e => e<Game>("game"));
		// return this.#game;
		return this.#initOrR(this.#game, () => Interop.run(e => e("game")));
	}

	static get ClientSocket(): typeof ClientSocket {
		return this.#initOrR(this.#clientSocket, () => Interop.run(e => e("ClientSocket")));
	}

	static get world() {
		// this.#world ??= runOnBridge(e => e<ClientWorld>("world"));
		// return this.#world;
		return this.#initOrR(this.#world, () => Interop.run(e => e<ClientWorld>("world")))
	}

	static get player() {
		// this.#player ??= runOnBridge(e => e<ClientEntityPlayer>("player"));
		// return this.#player;
		return this.#initOrR(this.#player, () => Interop.run(e => e<ClientEntityPlayer>("player")));
	}
}


export default Refs;
