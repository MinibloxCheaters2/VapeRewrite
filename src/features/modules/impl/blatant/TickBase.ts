import { Subscribe } from "@/event/api/Bus";
import type Cancelable from "@/event/api/Cancelable";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

// cancels a tick and then immediately adds {value of "boosts" setting} more.
// idk what to do with ts.
export default class TickBase extends Mod {
	public name = "TickBase";
	public category = Category.BLATANT;
	private tick = false;
	// set to `Date.now()` in playerTick
	#lastBoost = -1;
	#boostsDelaySetting = this.createSliderSetting(
		"Boost Delay",
		150,
		1,
		1e3,
		1,
	);
	#boostsSetting = this.createSliderSetting("Boosts", 2, 1, 50, 1);

	get #boostDelay() {
		return this.#boostsDelaySetting.value();
	}

	get #boosts() {
		return this.#boostsSetting.value();
	}

	@Subscribe("gameTick")
	private onTick() {
		const diff = Math.floor(
			Math.abs(Date.now() - this.#lastBoost),
		);
		if (
			diff >=
				this.#boostDelay
		) {
			this.tick = true;
		}
	}

	@Subscribe("playerTick")
	private onPlayerTick(wrap: Cancelable) {
		if (this.tick) {
			this.#lastBoost = Date.now();
			this.tick = false;
			wrap.cancel();
			for (let i = 0; i < Math.floor(this.#boosts); i++) {
				Refs.player.fixedUpdate();
			}
		}
	}
}
