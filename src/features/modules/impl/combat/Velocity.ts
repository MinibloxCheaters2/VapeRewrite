import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { S2CPacket } from "@/features/sdk/types/packetTypes";
import { s2c } from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Velocity extends Mod {
	public name = "Velocity";
	public category = Category.COMBAT;

	// Settings
	private h = this.createSliderSetting("Horizontal", 0, 0, 100, 1);
	private v = this.createSliderSetting("Vertical", 0, 0, 100, 1);

	get horizontal() {
		return this.h.value();
	}

	get vertical() {
		return this.v.value();
	}

	@Subscribe("receivePacket")
	onPacket(e: CancelableWrapper<S2CPacket>) {
		const { data: packet } = e;
		if (
			packet instanceof s2c("CPacketEntityVelocity") &&
			packet.id === Refs.player.id
		) {
			if (this.horizontal === 0 && this.vertical === 0) e.cancel();

			const pH = this.horizontal / 100;
			const pV = this.vertical / 100;
			packet.motion.x *= pH;
			packet.motion.y *= pV;
			packet.motion.z *= pH;
		}
		if (packet instanceof s2c("CPacketExplosion") && packet.playerPos) {
			if (this.horizontal === 0 && this.vertical === 0) e.cancel();

			const pH = this.horizontal / 100;
			const pV = this.vertical / 100;
			packet.playerPos.x *= pH;
			packet.playerPos.y *= pV;
			packet.playerPos.z *= pH;
		}
	}
}
