/**
 * Tracks the player's fall distance from the server's perspective.
 * @module
 */

import Bus from "@/Bus";
import { Priority, Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import PacketRefs from "./packetRefs";

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

	@Subscribe("sendPacket", Priority.READ_FINAL_STATE)
	private sendPacket({ data: pkt }: CancelableWrapper<C2SPacket>) {
		if (pkt instanceof PacketRefs.getRef("SPacketPlayerPosLook")) {
			this.handle(pkt.onGround, pkt.pos?.y);
		}
	}
})();
