import gameRefs from "@/utils/refs/game";
import Category from "@vape/core/features/modules/api/Category"
import Mod from "@vape/core/features/modules/api/Module"

export default class Test extends Mod {
	name = "Test";
	category = Category.UTILITY;
	protected onEnable(): void {
		// gameRefs.players.values().forEach(v => {
		// 	console.log(v, v.position);
		// });
		// betting this is some sort of culled variable
		gameRefs.players?.values?.()?.forEach?.(p => {
			if (!p?.label) return;
			console.log(p.label);
			p.label.WwNmWM = true;
		});
	}
}
