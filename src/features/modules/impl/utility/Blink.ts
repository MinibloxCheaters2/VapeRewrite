import { Subscribe } from "@/event/api/Bus";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import { Action, type PacketOutcome } from "@/utils/packetQueueManager";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Blink extends Mod {
	public name = "Blink";
	public category = Category.UTILITY;

	@Subscribe("queueC2SPacket")
	private handleQueue(outcome: PacketOutcome<C2SPacket>) {
		outcome.action = Action.QUEUE;
	}
}
