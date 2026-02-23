/**
 * Testing module, currently an exploit that allows you to mute other people's game audio for like 5 seconds when it throws >2 potions in the same tick.
 * latency is annoying since you need it to run in the same tick as them, and i.e. if you or they have a ping spike between ticks,
 * you'll be off-tick and it'll be all for nothing.
 * @module
 */

import { Subscribe } from "@/event/api/Bus";
import { c2s } from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

// TODO: find some sound that can easily be triggered, currently you need to hold potions in order for it to work.
export default class Test extends Mod {
	name = "Test";
	category = Category.BLATANT;

	#timesSetting = this.createSliderSetting("Times", 2, 1, 50, 1);
	#delaySetting = this.createSliderSetting("Delay", 1, 0, 100, 1);
	#waitCount = 0;

	get #times() {
		return this.#timesSetting.value();
	}

	get #delay() {
		return this.#delaySetting.value();
	}

	// would use SubscribeAsync but tick gets fired too often...
	@Subscribe("gameTick")
	private onTick() {
		if (this.#waitCount > 0) {
			this.#waitCount--;
			return;
		}
		for (let i = 0; i < this.#times; i++) {
			Refs.ClientSocket.sendPacket(new (c2s("SPacketUseItem"))());
		}
		this.#waitCount = this.#delay;
	}
}
