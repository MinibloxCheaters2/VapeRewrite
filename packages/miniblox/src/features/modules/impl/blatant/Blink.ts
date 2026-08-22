import type { C2SPacket } from "@wq2/miniblox-sdk";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import { Subscribe } from "@/event/Bus";
import { Action, type PacketOutcome } from "@/utils/network/packetQueueManager";

export default class Blink extends Mod {
	public name = "Blink";
	// same reason as FakeLag
	public category = Category.UTILITY;

	@Subscribe("queueC2SPacket")
	private handleQueue(outcome: PacketOutcome<C2SPacket>) {
		outcome.action = Action.QUEUE;
	}
}
