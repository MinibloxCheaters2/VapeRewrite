import type { C2SPacket } from "@wq2/miniblox-sdk";

import { Category } from "@vape-rewrite/core";
import { Mod } from "@vape-rewrite/core";

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
