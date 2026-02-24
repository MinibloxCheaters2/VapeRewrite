// TODO: support queueing S2C packets?

import type { Material, Mesh } from "three";
import type {
	PBFloatVector3,
	SPacketPlayerPosLook,
} from "@/features/sdk/types/packets";
import Bus from "../Bus";
import { Priority, Subscribe } from "../event/api/Bus";
import type CancelableWrapper from "../event/api/CancelableWrapper";
import type { AnyPacket, C2SPacket } from "../features/sdk/types/packetTypes";
import Rotation from "./aiming/rotation";
import PacketUtil from "./PacketUtil";
import { c2s } from "./packetRefs";
import getPosFromPacket from "./posPacket";
import Refs from "./refs";

export class PacketRecord<T> {
	constructor(
		public packet: T,
		public time: number,
	) {}
}

export enum Action {
	FLUSH,
	PASS,
	QUEUE,
}

export class PacketOutcome<P> {
	constructor(
		public packet: P,
		public action: Action,
	) {}
}

export default new (class PacketQueueManager {
	private packetQueue: PacketRecord<C2SPacket>[] = [];
	#posBox: Mesh;

	get serverPos(): PBFloatVector3 | undefined {
		return getPosFromPacket(
			this.packetQueue.find((p) => getPosFromPacket(p) !== undefined)
				?.packet,
		);
	}

	get serverRot(): Rotation | undefined {
		return Rotation.fromPacket(
			this.packetQueue.find(
				(p) =>
					p.packet instanceof c2s("SPacketPlayerPosLook") &&
					p.packet.yaw !== undefined &&
					p.packet.pitch !== undefined,
			)?.packet as SPacketPlayerPosLook | undefined,
		);
	}

	constructor() {
		Bus.registerSubscriber(this);
	}

	get lagging() {
		return this.packetQueue.length > 0;
	}

	/**
	 * @returns `Date.now() - this.packetQueue[0].time`, or `0` if `this.lagging` is false.
	 */
	laggingFor(): number {
		if (!this.lagging) return 0;
		return Date.now() - this.packetQueue[0].time;
	}

	/** this doesn't remove the packet from the packet queue since I'm lazy, you do that yourself. this just sends the packet. */
	private flushPacket<T extends C2SPacket>(record: PacketRecord<T>) {
		// TODO: only handling C2S packets
		PacketUtil.sendSilently(record.packet);
	}

	flush(when?: (p: PacketRecord<AnyPacket>) => boolean) {
		this.packetQueue = this.packetQueue.filter((p) => {
			const result = when?.(p) ?? true;

			if (result) this.flushPacket(p);

			return !result;
		});
	}

	#preProcessing(pkt: C2SPacket): "pass" | "flush" | undefined {
		if (pkt instanceof c2s("SPacketMessage")) return "pass";
		if (pkt instanceof c2s("SPacketRespawn")) return "flush";
	}

	@Subscribe("sendPacket", Priority.FINAL_DECISION)
	private onPacket(e: CancelableWrapper<C2SPacket>) {
		if (e.canceled) return;
		switch (this.#preProcessing(e.data)) {
			case "pass":
				return;
			case "flush":
				this.packetQueue.push(new PacketRecord(e.data, Date.now()));
				e.cancel();
				return;
			case undefined:
				break;
		}

		const outcome = new PacketOutcome(e.data, Action.FLUSH);

		Bus.emit("queueC2SPacket", outcome);

		if (outcome.action === Action.FLUSH) this.flush();

		if (outcome.action === Action.QUEUE) {
			this.packetQueue.push(new PacketRecord(outcome.packet, Date.now()));
			e.cancel();
		}
	}

	#hidePosBox() {
		if (!this.#posBox?.visible) return;
		this.#posBox.visible = false;
	}

	#updatePosBox() {
		if (!this.lagging) return;
		if (!this.serverPos) return;
		this.#posBox.visible = true;
		this.#posBox.position.set(
			this.serverPos.x,
			this.serverPos.y + 1,
			this.serverPos.z,
		);
	}

	#initPosBox() {
		const mesh = new Refs.Mesh(
			new Refs.BoxGeometry(1, Refs.player.height, 1),
		);
		this.#posBox = mesh;
		const mtr = mesh.material as Material;
		mtr.depthTest = false;
		mtr.transparent = true;
		mtr.opacity = 0.5;
		mesh.renderOrder = 6;
		mesh.visible = true;
		Refs.game.gameScene.ambientMeshes.add(mesh);
		return mesh;
	}

	@Subscribe("gameTick")
	private onRender() {
		if (!this.lagging) {
			this.#hidePosBox();
			return;
		}
		const sPos = this.serverPos;
		if (!sPos) {
			this.#hidePosBox();
			return;
		}
		if (!this.#posBox) this.#initPosBox();
		this.#updatePosBox();
	}
})();
