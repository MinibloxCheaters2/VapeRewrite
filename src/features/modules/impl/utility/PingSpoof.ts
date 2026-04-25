import { Subscribe } from "@/event/api/Bus";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import { Action, c2s, type PacketOutcome } from "@/utils";
import packetQueueManager from "@/utils/network/packetQueueManager";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class PingSpoof extends Mod {
	name = "PingSpoof";
	category = Category.UTILITY; // this isn't really blatant

	#infiniteSetting = this.createToggleSetting("Infinite", false);
	#delaySetting = this.createSliderSetting(
		"Milliseconds",
		5e3,
		1,
		10e3,
		undefined,
		() => !this.#infiniteSetting.value(),
	);

	get #infinite() {
		return this.#infiniteSetting.value();
	}

	get #delay() {
		return this.#delaySetting.value();
	}

	@Subscribe("queueC2SPacket")
	public cat(o: PacketOutcome<C2SPacket>) {
		if (
			o.packet instanceof c2s("SPacketPing") &&
			(this.#infinite ||
				packetQueueManager.laggingFor(
					(a) => a.packet instanceof c2s("SPacketPing"),
				) >= this.#delay)
		) {
			o.action = Action.QUEUE;
		} else {
			o.action = Action.PASS;
		}
	}
}
