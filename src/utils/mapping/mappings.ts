/**
 * Contains various mappings for objects. These are used in the auto-remapping proxy, so you don't have to think about using dumps ever again!
 * @module
 */
import type { DumpKey } from "@/hooks/dump";
import { MATCHED_DUMPS } from "@/hooks/replacement";
import initOrR from "../helpers/initOrR";
import type { Mapping } from "../helpers/remapProxy";

function ofDumps<K extends DumpKey>(...ks: K[]) {
	return Object.fromEntries(
		ks.map((k) => [MATCHED_DUMPS[k], k]).filter(([k]) => k !== undefined),
	);
}

export default new (class Mappings {
	#playerController?: Mapping;
	#playerControllerMP?: Mapping;
	#world?: Mapping;
	#ClientEntityPlayer?: Mapping;
	get playerController() {
		return initOrR(this.#playerController, ofDumps("windowClick"));
	}
	get playerControllerMP() {
		return initOrR(this.#playerControllerMP, ofDumps("syncItem"));
	}
	get world() {
		return initOrR(this.#world, () => ofDumps("entities"));
	}
	get ClientEntityPlayer() {
		return initOrR(this.#ClientEntityPlayer, () =>
			ofDumps("moveForward", "moveStrafe", "lastReportedYaw", "attack"),
		);
	}
})();
