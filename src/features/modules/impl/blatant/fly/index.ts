import { Subscribe } from "@/event/Bus";
import Refs from "@/utils/helpers/refs";
import DesyncManager from "@/utils/movement/DesyncManager";
import Category from "../../../api/Category";
import Mod from "../../../api/Module";
import InfiniteSub from "./infinite";
import NormalSub from "./normal";

export default class Fly extends Mod {
	public name = "Fly";
	public category = Category.BLATANT;

	private modesGroup = this.createSubmoduleGroup(
		"Modes",
		["Normal", "Infinite (Old AC)"],
		"Normal",
	);

	public normalSub = new NormalSub(
		this,
		this.modesGroup.submodules[0].settings,
	);
	private infiniteSub = new InfiniteSub(
		this,
		this.modesGroup.submodules[1].settings,
	);

	public verticalSetting = this.createSliderSetting(
		"Vertical",
		0.12,
		0.05,
		1.0,
		0.01,
	);

	public desynced = false;
	public ticks = 0;
	private warned = false;

	private get mode(): string {
		return this.modesGroup.value();
	}

	protected onEnable(): void {
		this.ticks = 0;

		if (this.mode === "Infinite (Old AC)" && !this.warned) {
			Refs.chat.addChat({
				text: "Infinite Fly only works on servers using the old AC",
				color: "yellow",
			});
			Refs.chat.addChat({
				text: "(KitPvP, Skywars, Eggwars, Bridge Duels use new AC)",
				color: "gray",
			});
			this.warned = true;
		}
	}

	protected onDisable(): void {
		if (this.desynced) {
			DesyncManager.desync = false;
			this.desynced = false;
		}

		if (this.mode === "Normal") {
			this.normalSub.onDisable(this);
		}

		if (this.mode === "Infinite (Old AC)") {
			this.infiniteSub.onDisable(this);
		}

		this.ticks = 0;
	}

	@Subscribe("gameTick")
	public onTick() {
		const speed = this.normalSub.speedSetting.value();
		switch (this.mode) {
			case "Normal":
				this.normalSub.onTick(this);
				break;
			case "Infinite (Old AC)":
				this.infiniteSub.onTick(this, speed);
				break;
		}
	}

	public getTag(): string {
		const speed = this.normalSub.speedSetting.value();
		switch (this.mode) {
			case "Normal":
				return this.normalSub.getTag();
			case "Infinite (Old AC)":
				return this.infiniteSub.getTag(speed);
			default:
				return this.mode;
		}
	}
}
