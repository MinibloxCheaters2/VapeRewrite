import { MATCHED_DUMPS } from "@/hooks/replacement";
import initOrR from "./initOrR";
import type { Mapping } from "./remapProxy";

export default new (class Mappings {
	#playerController: Mapping;
	#playerControllerMP: Mapping;
	#world: Mapping;
	#ClientEntityPlayer: Mapping;
	get playerController() {
		return initOrR(this.#playerController, () => ({
			[MATCHED_DUMPS.windowClick]: "windowClick",
		}));
	}
	get playerControllerMP() {
		return initOrR(this.#playerControllerMP, () => ({
			[MATCHED_DUMPS.syncItem]: "syncItem",
		}));
	}
	get world() {
		return initOrR(this.#world, () => ({
			[MATCHED_DUMPS.entities]: "entities",
		}));
	}
	get ClientEntityPlayer() {
		return initOrR(this.#ClientEntityPlayer, () => ({
			[MATCHED_DUMPS.moveForward]: "moveForward",
			[MATCHED_DUMPS.moveStrafe]: "moveStrafe",
			[MATCHED_DUMPS.lastReportedYaw]: "lastReportedYaw",
		}));
	}
})();
