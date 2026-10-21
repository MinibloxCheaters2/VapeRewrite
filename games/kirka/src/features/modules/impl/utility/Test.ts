import mappings from "@/utils/mappings/mappings";
import gameRefs from "@/utils/refs/game";
import { Category } from "@vape-rewrite/core"
import { Mod } from "@vape-rewrite/core"
import { remapObj } from "@vape-rewrite/core";

export default class Test extends Mod {
	name = "Test";
	category = Category.UTILITY;
	protected onEnable(): void {
		// gameRefs.players.values().forEach(v => {
		// 	console.log(v, v.position);
		// });
		// betting this is some sort of culled variable
		gameRefs.players?.values()?.forEach(p => {
			// TODO
			// Object.defineProperty(p.info, "occluded", {
			// 	value: false,
			// 	writable: false,
			// 	configurable: false,
			// 	enumerable: false
			// })
		});
	}
}
