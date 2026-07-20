import type { C2SPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import { c2s } from "@/utils/network/packetRefs";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class WTap extends Mod {
	public name = "WTap";
	public category = Category.COMBAT;

	@Subscribe("sendPacket")
	private onPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (
			packet instanceof c2s("SPacketUseEntity") &&
			packet.action === 1 /*ATTACK*/ &&
			Miniblox.player.isSprinting()
		) {
			Miniblox.player.serverSprintState = false;
		}
	}
}
