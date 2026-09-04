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
		return Refs.game?.getMyPlayer();
	}
};

expose("Refs", () => Refs);

export default Refs;
