import mappings from "@/utils/mappings/mappings";
import gameRefs from "@/utils/refs/game";
import Category from "@vape/core/features/modules/api/Category"
import Mod from "@vape/core/features/modules/api/Module"
import remapObj from "@vape/core/utils/helpers/remapProxy";

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
