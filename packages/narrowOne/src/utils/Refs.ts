/**
 * Really only exists because we don't have the full `main` object until a few seconds in.
 * @module
 */

import { game } from "@/hooks/gameHook";
import { main } from "@/hooks/mainHook";
import { expose } from "@vape/core/exposed";

const Refs = {
	get game() {
		return main?.gameManager?.activeGame ?? game;
	},
	get player(): NonNullable<any> | null {
		const game = Refs.game;
		if (!game) return null;
		// avoid calling the method.
		// this is useless since only the background game doesn't have `myPlayer`,
		// and instead just scans `players.values` for what player it owns.
		return game.myPlayer ?? game.getMyPlayer();
	},
	get players(): Map<number, any> | undefined {
		return Refs.game?.players;
	},
	/**
	 * **IMPORTANT**:
	 * this requires access to `main`, avoid using this or use a fallback if possible.
	 */
	get network() {
		return main?.network;
	}
};

expose("Refs", () => Refs);

export default Refs;
