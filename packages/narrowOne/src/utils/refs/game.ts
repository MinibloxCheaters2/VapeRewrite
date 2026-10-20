/**
 * Really only exists because we don't have the full `main` object until a few seconds in.
 * @module
 */

import { gameObj, ready as gameReady } from "@/hooks/gameHook";
import { main, ready as mainReady } from "@/hooks/mainHook";
import { expose } from "@vape/core/src/exposed";
import type { Game, GameManager, NetworkManager, OnlineGame, Player } from "@wq2/narrow-one-types/src/game";

export const anyReady = Promise.race([gameReady, mainReady]);

const gameRefs = {
	get settingsManager() {
		return main?.settingsManager ?? gameRefs.player?.settingsManager;
	},
	get instance(): Game | undefined {
		return main?.gameManager.activeGame ?? gameObj;
	},
	get onlineInstance(): OnlineGame | undefined {
		const i = gameRefs.instance;
		if (!("chat" in i)) return undefined;
		return i;
	},
	get player(): Player | null {
		const game = this.instance;
		if (!game) return null;
		// avoid calling the method.
		// this is useless since only the background game has `myPlayer`,
		// and the online game instead just scans `players.values` for what player it owns.
		return game.myPlayer ?? game.getMyPlayer();
	},
	get players(): Map<number, Player> | undefined {
		return this.instance?.players;
	},
	/**
	 * **IMPORTANT**:
	 * this requires access to `main`, avoid using this or use a fallback if possible.
	 */
	get network(): NetworkManager | undefined {
		return main?.network;
	},
	/**
	 * **IMPORTANT**:
	 * this requires access to `main`, avoid using this or use a fallback if possible.
	 */
	get gameManager(): GameManager | undefined {
		return main?.gameManager;
	}
};

expose("Refs", () => gameRefs);

export default gameRefs;
