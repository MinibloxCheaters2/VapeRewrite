import { Subscribe } from "@/event/Bus";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

// The one and only...
export default class Sprint extends Mod {
	name = "Sprint";
	category = Category.UTILITY;
	#legitSetting = this.createToggleSetting("Legit", true);

	get #legit() {
		return this.#legitSetting.value();
	}

	@Subscribe("gameTick")
	private onTick() {
		if (this.#legit) Miniblox.player.sprintToggleTimer = 7;
		else Miniblox.player.setSprinting(true); // TODO: adjust jump yaw so we don't jump forwards when moving backwards?
	}
}
