// TODO: support queueing S2C packets?

import type {
	PBFloatVector3,
	SPacketPlayerPosLook,
} from "@/features/sdk/types/packets";
import Bus from "../Bus";
import { Priority, Subscribe } from "../event/api/Bus";
import type CancelableWrapper from "../event/api/CancelableWrapper";
import type { AnyPacket, C2SPacket } from "../features/sdk/types/packetTypes";
import PacketUtil from "./PacketUtil";
import PacketRefs from "./packetRefs";

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

	get serverPos(): PBFloatVector3 | undefined {
		return (
			this.packetQueue.find(
				(p) =>
					p.packet instanceof
						PacketRefs.getRef("SPacketPlayerPosLook") &&
					p.packet.pos,
			)?.packet as SPacketPlayerPosLook | undefined
		)?.pos;
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
		if (pkt instanceof PacketRefs.getRef("SPacketMessage")) return "pass";
		if (pkt instanceof PacketRefs.getRef("SPacketRespawn")) return "flush";
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
})();
