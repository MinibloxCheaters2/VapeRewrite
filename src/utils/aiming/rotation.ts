import { Priority, Subscribe } from "../../event/api/Bus";
import CancelableWrapper from "../../event/api/CancelableWrapper";
import SubscribeOnInit from "../../event/api/SubscribeOnInit";
import { C2SPacket } from "../../features/sdk/types/packetTypes";
import PacketRefs from "../packetRefs";
import Refs from "../refs";

export class Rotation {
	static readonly ZERO: Rotation = new Rotation(0, 0);
	constructor(public yaw: number, public pitch: number) {}
	copy(yaw = this.yaw, pitch = this.pitch) {
		return new Rotation(yaw, pitch);
	}
}

export class RotationTarget {
	constructor(public rotation: Rotation, public ticksUntilReset: number, public resetThreshold: number = 180) {}
}

export default new class RotationManager extends SubscribeOnInit {
	currentRotation: Rotation = Rotation.ZERO;
	targetRotation: Rotation = Rotation.ZERO;
	get playerRotation() {
		return new Rotation(Refs.player.yaw, Refs.player.pitch);
	}

	#actualServerRotation: Rotation = Rotation.ZERO;

	get actualServerRotation() {
		return this.#actualServerRotation;
	}

	get serverRotation() {
		return this.currentRotation ?? this.playerRotation;
	}

	set serverRotation(rot: Rotation) {
		this.currentRotation = rot;
	}

	@Subscribe("sendPacket", Priority.READ_FINAL_STATE)
	#onSend({ canceled, data: packet }: CancelableWrapper<C2SPacket>) {
		if (!canceled && packet instanceof PacketRefs.getRef("SPacketPlayerPosLook")) {
			this.#actualServerRotation = new Rotation(packet.yaw, packet.pitch);
		}
	}
};
