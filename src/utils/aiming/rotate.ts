/**
 * Manages rotation
 * @module
 */

import type { C2SPacket } from "@wq2/miniblox-sdk";
import Bus from "@/Bus";
import { Priority, Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import MovementCorrection from "../movement/MovementCorrection";
import { isC2S } from "../network/PacketUtil";
import packetQueueManager from "../network/packetQueueManager";
import Miniblox from "../refs/miniblox";
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
	constructor() {
		Bus.registerSubscriber(this);
	}
	get currentPlan() {
		return this.#currentPlan;
	}
	get playerRot() {
		return new Rotation(Miniblox.player.yaw, Miniblox.player.pitch);
	}
	get trackedRot() {
		return this.#trackedRot;
	}
	get serverRotation() {
		return packetQueueManager.serverRot ?? this.#trackedRot;
	}
	get activeRotation() {
		return this.#currentPlan?.target ?? this.playerRot;
	}
	scheduleRotation(plan: RotationPlan) {
		this.#currentPlan = plan;
	}
	@Subscribe("sendPacket", Priority.LOWEST)
	private onPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (isC2S("SPacketPlayerPosLook", packet)) {
			const plan = this.#currentPlan;
			if (!plan) return;
			if (plan) {
				plan.resetIn--;
				if (plan.resetIn <= 0) {
					this.#currentPlan = undefined;
				}
			}
			const { yaw, pitch } = plan.target;
			const { player } = Miniblox;
			if (yaw - player.lastReportedYaw !== 0 || pitch - player.lastReportedPitch !== 0) {
				player.lastReportedYaw = yaw;
				player.lastReportedPitch = pitch;
				packet.yaw = yaw;
				packet.pitch = pitch;
			}
			if (Rotation.hasRotation(packet)) this.#trackedRot = Rotation.fromPacket(packet)!;
		} else if (isC2S("SPacketPlayerInput", packet)) {
			const plan = this.#currentPlan;
			if (!plan) return;
			if (plan) {
				plan.resetIn--;
				if (plan.resetIn <= 0) {
					this.#currentPlan = undefined;
				}
			}
			const { yaw, pitch } = plan.target;
			const { player } = Miniblox;
			if (yaw - player.lastReportedYaw !== 0 || pitch - player.lastReportedPitch !== 0) {
				player.lastReportedYaw = yaw;
				player.lastReportedPitch = pitch;
				packet.yaw = yaw;
				packet.pitch = pitch;
			}
			this.#trackedRot = Rotation.fromPacket(packet)!;
		}
	}
})();
