import { Subscribe } from "@/event/Bus";
import Category from "../../../api/Category";
import Mod from "../../../api/Module";
import NormalSub from "./normal";

export default class Fly extends Mod {
	public name = "Fly";
	public category = Category.BLATANT;

	private modesGroup = this.createSubmoduleGroup(
		"Modes",
		["Normal"],
		"Normal",
	);

	public normalSub = new NormalSub(
		this,
		this.modesGroup.submodules[0].settings,
	);

	public verticalSetting = this.createSliderSetting(
		"Vertical",
		0.12,
		0.05,
		1.0,
		0.01,
	);

	private get mode(): string {
		return this.modesGroup.value();
	}

	protected onDisable(): void {
		if (this.mode === "Normal") {
			this.normalSub.onDisable(this);
		}
	}

	@Subscribe("gameTick")
	public onTick() {
		switch (this.mode) {
			case "Normal":
				this.normalSub.onTick(this);
				break;
		}
	}

	public getTag(): string {
		switch (this.mode) {
			case "Normal":
				return this.normalSub.getTag();
			default:
				return this.mode;
		}
	}
}
