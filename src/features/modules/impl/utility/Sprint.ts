import { Subscribe } from "@/event/api/Bus";
import Refs from "@/utils/helpers/refs";
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
		if (this.#legit) Refs.player.sprintToggleTimer = 7;
		else Refs.player.setSprinting(true); // TODO: adjust jump yaw so we don't jump forwards when moving backwards?
	}
}
