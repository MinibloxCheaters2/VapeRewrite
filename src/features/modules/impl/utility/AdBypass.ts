import { Subscribe } from "@/event/Bus";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

interface AdProvider {
	playRewardedAd(): Promise<boolean>;
	shouldPlayVideoAd(): boolean;
}

let origPlayRewardedAd: AdProvider["playRewardedAd"] | undefined;
let origShouldPlayVideoAd: AdProvider["shouldPlayVideoAd"] | undefined;

export default class AdBypass extends Mod {
	public static readonly INSTANCE = new AdBypass();
	private constructor() {
		super();
	}
	name = "AdBypass";
	category = Category.UTILITY;

	/** Installs the proxies; returns false if the game/ad provider isn't mounted yet. */
	private install(): boolean {
		const ads = Miniblox.game?.cubicBezier as unknown as AdProvider | undefined;
		if (
			!ads ||
			typeof ads.playRewardedAd !== "function" ||
			typeof ads.shouldPlayVideoAd !== "function"
		) {
			return false;
		}

		origPlayRewardedAd = ads.playRewardedAd;
		ads.playRewardedAd = new Proxy(origPlayRewardedAd, {
			apply(/*target, thisArg, argArray*/) {
				return Promise.resolve(true);
			},
		});
		origShouldPlayVideoAd = ads.shouldPlayVideoAd;
		ads.shouldPlayVideoAd = new Proxy(origShouldPlayVideoAd, {
			apply(/*target, thisArg, argArray*/) {
				return false;
			},
		});
		return true;
	}

	/** Restores the original functions so the module can be cleanly toggled. */
	private uninstall(): void {
		const ads = Miniblox.game?.cubicBezier as unknown as AdProvider | undefined;
		if (!ads) return;
		if (origPlayRewardedAd) {
			ads.playRewardedAd = origPlayRewardedAd;
			origPlayRewardedAd = undefined;
		}
		if (origShouldPlayVideoAd) {
			ads.shouldPlayVideoAd = origShouldPlayVideoAd;
			origShouldPlayVideoAd = undefined;
		}
	}

	protected onEnable(): void {
		this.install();
	}

	@Subscribe("playerTick")
	onTick(): void {
		if (!origPlayRewardedAd) {
			this.install();
		}
	}

	protected onDisable(): void {
		this.uninstall();
	}
}
