/**
 * Managers rotation
 * @module
 */

import type { C2SPacket } from "@wq2/miniblox-sdk";
import Bus from "@/Bus";
import { Priority, Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import Refs from "../helpers/refs";
import MovementCorrection from "../movement/MovementCorrection";
import packetQueueManager from "../network/packetQueueManager";
import { c2s } from "../network/packetRefs";
import Rotation from "./rotation";

export class RotationPlan {
	constructor(
		public target: Rotation,
		public movementCorrection: MovementCorrection = MovementCorrection.Auto,
		public resetIn = 1,
	) {}
}

export default new (class RotationManager {
	#currentPlan: RotationPlan | undefined = undefined;
	#trackedRot = Rotation.ZERO;
	get currentPlan() {
		return this.#currentPlan;
	}
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
	@Subscribe("sendPacket", Priority.LOWEST)
	private onPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (packet instanceof c2s("SPacketPlayerPosLook")) {
			if (Rotation.hasRotation(packet))
				// biome-ignore lint/style/noNonNullAssertion: we know it's not undefined
				this.#trackedRot = Rotation.fromPacket(packet)!;
			const plan = this.#currentPlan;
			if (!plan) return;
			if (plan) {
				plan.resetIn--;
				if (plan.resetIn <= 0) {
					this.#currentPlan = undefined;
				}
			}
		}
	}
})();
