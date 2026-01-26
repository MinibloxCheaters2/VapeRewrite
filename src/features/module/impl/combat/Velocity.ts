// reduction amounts

import { Subscribe } from "@/event/api/Bus";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import CancelableWrapper from "@/event/api/CancelableWrapper";
import { S2CPacket } from "@/features/sdk/types/packetTypes";
import PacketRefs from "@/utils/packetRefs";

// TODO: these should be settings
const HORIZONTAL = 0;
const VERTICAL = 0;

export default class Velocity extends Mod {
	public name = "Velocity";
	public category = Category.COMBAT;

	@Subscribe("receivePacket")
	onPacket(e: CancelableWrapper<S2CPacket>) {
		const { data: packet } = e;
		if (packet instanceof PacketRefs.getRef("CPacketEntityVelocity") && packet.id === Refs.player.id) {
			if (HORIZONTAL === 0 && VERTICAL === 0) e.cancel();

			const pH = HORIZONTAL / 100;
			const pV = VERTICAL / 100;
			packet.motion.x *= pH;
			packet.motion.y *= pV;
			packet.motion.z *= pH;
		}
		if (packet instanceof PacketRefs.getRef("CPacketExplosion") && packet.playerPos) {
			if (HORIZONTAL === 0 && VERTICAL === 0) e.cancel();

			const pH = HORIZONTAL / 100;
			const pV = VERTICAL / 100;
			packet.playerPos.x *= pH;
			packet.playerPos.y *= pV;
			packet.playerPos.z *= pH;
		}
	}
}
