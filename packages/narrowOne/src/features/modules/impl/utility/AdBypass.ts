import Category from "@vape/core/features/modules/api/Category"
import Mod from "@vape/core/features/modules/api/Module"
import createProxy from "@vape/core/utils/helpers/proxy";

let origRewardedBreak: () => Promise<boolean>;

export default class AdBypass extends Mod {
	name = "AdBypass";
	category = Category.UTILITY;
	protected onEnable(): void {
		setTimeout(() => {
			const poki = unsafeWindow.PokiSDK;
			if (!poki) return;
			origRewardedBreak = poki.rewardedBreak;
			poki.rewardedBreak = createProxy(origRewardedBreak, {
				apply(target, thisArg, argArray: []) {
					return Promise.resolve(true);
				},
			});
		}, 1e3);
	}
	protected onDisable(): void {
		const poki = unsafeWindow.PokiSDK;
		if (!poki) return;
		poki.rewardedBreak = origRewardedBreak;
	}
}
