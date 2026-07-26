import type { S2CPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import { isS2C } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

function motionOrReduce<T extends "x" | "y" | "z">(axis: T, n: number, reduce: number) {
	return reduce === 0 ? Miniblox.player.motion[axis] : n * reduce;
}

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
		if (isS2C("CPacketEntityVelocity", packet) && packet.id === Miniblox.player.id) {
			if (this.horizontal === 0 && this.vertical === 0) e.cancel();

			const pH = this.horizontal / 100;
			const pV = this.vertical / 100;
			packet.motion.x *= motionOrReduce("x", packet.motion.x, pH);
			packet.motion.y *= motionOrReduce("y", packet.motion.y, pV);
			packet.motion.z *= motionOrReduce("z", packet.motion.z, pH);
		}
		if (isS2C("CPacketExplosion", packet) && packet.playerPos) {
			if (this.horizontal === 0 && this.vertical === 0) {
				packet.playerPos = undefined;
				return;
			}

			const pH = this.horizontal / 100;
			const pV = this.vertical / 100;
			packet.playerPos.x = motionOrReduce("x", packet.playerPos.x, pH);
			packet.playerPos.y = motionOrReduce("y", packet.playerPos.y, pV);
			packet.playerPos.z = motionOrReduce("z", packet.playerPos.z, pH);
		}
	}
}
