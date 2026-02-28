/**
 * Managers rotation
 * @module
 */

import Bus from "@/Bus";
import { Priority, Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import Refs from "../helpers/refs";
import packetQueueManager from "../network/packetQueueManager";
import { c2s } from "../network/packetRefs";
import Rotation from "./rotation";

export class RotationPlan {
	constructor(
		public target: Rotation,
		public resetIn = 1,
	) {}
}

export default new (class RotationManager {
	#currentPlan: RotationPlan | undefined = undefined;
	#trackedRot = Rotation.ZERO;
	get playerRot() {
		return new Rotation(Refs.player.yaw, Refs.player.pitch);
	}
	get serverRotation() {
		return packetQueueManager.serverRot ?? this.#trackedRot;
	}
	get activeRotation() {
		return this.#currentPlan?.target ?? this.playerRot;
	}
	constructor() {
		Bus.registerSubscriber(this);
	}
	scheduleRotation(plan: RotationPlan) {
		this.#currentPlan = plan;
	}
	// only handles packets that weren't canceled above (i.e. from packet queue manager)
	@Subscribe("sendPacket", Priority.READ_FINAL_STATE)
	private onPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (
			packet instanceof c2s("SPacketPlayerPosLook") &&
			packet.yaw !== undefined &&
			packet.pitch !== undefined
		) {
			this.#trackedRot = Rotation.fromPacket(packet);
			const plan = this.#currentPlan;
			if (plan) {
				if (plan.resetIn <= 0) {
					this.#currentPlan = undefined;
				}
				plan.resetIn--;
			}
		}
	}
})();
