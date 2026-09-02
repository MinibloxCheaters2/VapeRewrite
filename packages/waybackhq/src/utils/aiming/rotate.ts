/**
 * Manages rotation
 * @module
 */

import type CancelableWrapper from "@vape/core/event/CancelableWrapper";

import { Priority } from "@vape/core/index";

import Bus from "@/Bus";
import Refs from "@/hooks/game";
import { AnyPacket } from "@/hooks/packetHook";
import { mod as protocol } from "@/utils/wrappers/protocol";

import MovementCorrection from "../movement/MovementCorrection";
import packetQueueManager from "../network/packetQueueManager";
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
		return new Rotation(Refs.player.rotationYaw, Refs.player.rotationPitch);
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
	@Bus.Subscribe("playerTick")
	private onTick() {
		const { currentPlan: plan } = this;
		if (!plan) return;
		// Refs.player.rotationYawHead = plan.target.yaw;
		plan.resetIn--;
		if (plan.resetIn <= 0) {
			this.#currentPlan = undefined;
		}
	}
	@Bus.Subscribe("sendPacket", Priority.LOWEST)
	private onPacket(wrap: CancelableWrapper<AnyPacket>) {
		const { currentPlan: plan } = this;
		if (!plan) return;
		const { target } = plan;
		switch (wrap.data[0]) {
			case protocol.PACKET.INPUT: {
				const inp = protocol.decodeMove(wrap.data);
				const { yaw, pitch } = plan.target;
				const { player } = Refs;
				if (yaw - player.prevRotationYaw !== 0 || pitch - player.prevRotationPitch !== 0) {
					player.prevRotationYaw = yaw;
					player.prevRotationPitch = pitch;
					inp.yaw = yaw;
					inp.pitch = pitch;
				}
				this.#trackedRot = Rotation.fromPacket(inp)!;
				wrap.data = protocol.encodeMove(inp) as AnyPacket;
				break;
			}
			case protocol.PACKET.ACTION: {
				const act = protocol.decodeAction(wrap.data);
				wrap.data = protocol.encodeAction(
					act.seq,
					act.attacks,
					act.attackTarget,
					act.useDown,
					act.useUp,
					act.drop,
					act.slot,
					target.yaw,
					target.pitch,
					act.stateAck,
				) as AnyPacket;
				break;
			}
		}
	}
})();
