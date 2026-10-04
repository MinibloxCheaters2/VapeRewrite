import type CancelableWrapper from "@vape/core/event/CancelableWrapper";
import type { C2SPacket } from "@wq2/miniblox-sdk";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import { Subscribe } from "@/event/Bus";
import { isC2S } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";

export default class WTap extends Mod {
	public name = "WTap";
	public category = Category.COMBAT;

	@Subscribe("sendPacket")
	private onPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (
			isC2S("SPacketUseEntity", packet) &&
			packet.action === 1 /*ATTACK*/ &&
			Miniblox.player.isSprinting()
		) {
			Miniblox.player.serverSprintState = false;
		}
	}
}
