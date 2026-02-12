import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import { c2s } from "@/utils/packetRefs";
import Refs from "@/utils/refs";
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
			Refs.player.isSprinting()
		) {
			Refs.player.serverSprintState = false;
		}
	}
}
