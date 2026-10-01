/**
 * Really only exists because we don't have the full `main` object until a few seconds in.
 * @module
 */

import { gameObj, ready as gameReady } from "@/hooks/gameHook";
import { main, ready as mainReady } from "@/hooks/mainHook";
import { expose } from "@vape/core/exposed";

export const anyReady = Promise.race([gameReady, mainReady]);

const gameRefs = {
	get instance() {
		return main?.gameManager?.activeGame ?? gameObj;
	},
	get player(): NonNullable<any> | null {
		const game = this.instance;
		if (!game) return null;
		// avoid calling the method.
		// this is useless since only the background game doesn't have `myPlayer`,
		// and instead just scans `players.values` for what player it owns.
		return game.myPlayer ?? game.getMyPlayer();
	},
	get players(): Map<number, any> | undefined {
		return this.instance?.players;
	},
	/**
	 * **IMPORTANT**:
	 * this requires access to `main`, avoid using this or use a fallback if possible.
	 */
	get network() {
		return main?.network;
	}
};

expose("Refs", () => gameRefs);

export default gameRefs;
