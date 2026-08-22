import { expose } from "@vape/core/exposed";
import type { ClientPlayer } from "@wq2/waybackhq-types/src/client/clientplayer";
import type { Game } from "@wq2/waybackhq-types/src/game";
import type { Session } from "@wq2/waybackhq-types/src/net/session";
import type { World } from "@wq2/waybackhq-types/src/world/world";
// import logger from "@vape/core/utils/logging/loggers";

const uiCtx = import("@wq2/waybackhq-types/src/ui/context");
let _game: Game;
export const ready = uiCtx.then(({ game }) => {
	_game = game;
});

const Refs = {
	get game() {
		return _game;
	},
	get player(): ClientPlayer | null {
		return _game?.localPlayer;
	},
	get world(): World | null {
		return _game?.world;
	},
	get session(): Session | null {
		return _game?.session;
	},
	get timer() {
		return _game?.timer;
	},
	get input() {
		return _game?.input;
	},
};
export default Refs;

expose("Refs", () => Refs);
