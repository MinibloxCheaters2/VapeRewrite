import { Category } from "@vape/core"
import { Mod } from "@vape/core"
import { createProxy } from "@vape/core";

let origRewardedBreak: () => Promise<boolean>;

export default class AdBypass extends Mod {
	name = "AdBypass";
	category = Category.UTILITY;
	#waitForSDKLoad(): Promise<any> {
		return new Promise<any>(r => {
			if ("PokiSDK" in unsafeWindow) return r(unsafeWindow.PokiSDK);
			let t: number;
			t = setInterval(() => {
				if ("PokiSDK" in unsafeWindow) {
					clearInterval(t);
					return r(unsafeWindow.PokiSDK);
				}
			}, 0.6e3);
		});
	}
	protected onEnable(): void {
		this.#waitForSDKLoad().then(r => {
			origRewardedBreak = r.rewardedBreak;
			r.rewardedBreak = createProxy(origRewardedBreak, {
				apply() {
					return Promise.resolve(true);
				},
			});
		});
	}
	protected onDisable(): void {
		this.#waitForSDKLoad().then(r => r.rewardedBreak = origRewardedBreak);
	}
}
