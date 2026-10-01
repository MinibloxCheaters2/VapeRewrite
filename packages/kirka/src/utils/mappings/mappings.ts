/**
 * Contains various mappings for objects. These are used in the auto-remapping proxy, so you don't have to think about using dumps ever again!
 * @todo consider using strings from source code for mappings.
 * @module
 */

import initOrR from "@vape/core/utils/helpers/initOrR";
import { reverseMapping, type Mapping } from "@vape/core/utils/helpers/remapProxy";

import gameRefs from "../refs/game";
import { Game, Player, World } from "../types/unknown";

function mapFromLPlr(lplr: Player): Mapping {
	const entries = Object.entries(lplr);
	// we only need the keys for creating mappings.
	// mappings only change every update, not every script load or whatever.
	const [rank] = entries.find(([, x]) => x != null && typeof x === "string" && x === "USER");
	const [team] = entries.find(
		([, x]) => x != null && typeof x === "string" && ["red", "blue"].includes(x),
	);
	const [id] = entries.find(([, x]) => x != null && typeof x === "string" && x.length === 9);
	return reverseMapping({
		rank,
		team,
		id,
	});
}
function mapFromGame(game: Game): Mapping {
	const entries = Object.entries(game);
	const [localPlayer] = entries.find(
		([, x]) => x != null && Object.keys(x).includes("fillMoveX___SYNC"),
	);
	const [world] = entries.find(
		([, x]) =>
			x != null &&
			typeof x === "object" &&
			["player", "dtRatio", "time", "scene2", "bulletCases"].every((q) => q in x),
	);
	return reverseMapping({
		localPlayer,
		world,
	});
}
function mapFromWorld(world: World): Mapping {
	const entries = Object.entries(world);
	const [players] = entries.find(
		// size > 1 can be false if you're the only one in the game.
		([, x]) => typeof x === "object" && x instanceof Map /*&& x.size > 1*/,
	);
	return reverseMapping({
		players,
	});
}

export default new (class Mappings {
	#Player?: Mapping;
	#world?: Mapping;
	#game?: Mapping;
	get player() {
		return initOrR(this.#Player, () => {
			const { localPlayer } = gameRefs;
			if (!localPlayer) return;
			return mapFromLPlr(localPlayer);
		});
	}
	get game() {
		return initOrR(this.#game, () => {
			const { rawGame } = gameRefs;
			if (!rawGame) return;
			return mapFromGame(rawGame);
		});
	}
	get world() {
		return initOrR(this.#world, () => {
			const { rawWorld } = gameRefs;
			if (!rawWorld) return;
			return mapFromWorld(rawWorld);
		});
	}
})();
