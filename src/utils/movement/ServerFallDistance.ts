/**
 * Tracks the player's fall distance from the server's perspective.
 * @module
 */

import type { C2SPacket } from "@wq2/miniblox-sdk";
import Bus from "@/Bus";
import { Priority, Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import { c2s } from "../network/packetRefs";

export default new (class PacketFallDistance {
	currentFallDistance = 0;
	#lastY: number = -Infinity;

	constructor() {
		Bus.registerSubscriber(this);
	}

	handle(onGround: boolean, y?: number) {
		if (onGround) {
			this.currentFallDistance = 0;
			return;
		}
		if (y === undefined) return;
		if (y >= this.#lastY) {
			this.#lastY = y;
			return;
		}
		const diff = this.#lastY - y;
		this.#lastY = y;
		this.currentFallDistance += Math.abs(diff);
	}

	@Subscribe("sendPacket", Priority.LOWEST)
	private sendPacket({ data: pkt }: CancelableWrapper<C2SPacket>) {
		if (pkt instanceof c2s("SPacketPlayerPosLook")) {
			this.handle(pkt.onGround, pkt.pos?.y);
		}
	}
})();
