// TODO: support queueing S2C packets?

import Bus from "../Bus";
import { Priority, Subscribe } from "../event/api/Bus";
import CancelableWrapper from "../event/api/CancelableWrapper";
import SubscribeOnInit from "../event/api/SubscribeOnInit";
import { AnyPacket, C2SPacket } from "../features/sdk/types/packetTypes";
import PacketUtil from "./PacketUtil";

export class PacketRecord<T> {
	packet: T;
	time: number;
}

export enum Action {
	FLUSH,
	PASS,
	QUEUE
}

export class PacketOutcome<P> {
	constructor(public packet: P, public action: Action) {}
}

export default new class PacketQueueManager extends SubscribeOnInit {
	private packetQueue: PacketRecord<C2SPacket>[] = [];
	get lagging() { return this.packetQueue.length > 0; }

	/** this doesn't remove the packet from the packet queue since I'm lazy, you do that yourself. this just sends the packet. */
	private flushPacket<T extends C2SPacket>(record: PacketRecord<T>) {
		// TODO: only handling C2S packets
		PacketUtil.sendSilently(record);
	}

	flush(when?: (p: PacketRecord<AnyPacket>) => boolean) {
		this.packetQueue = this.packetQueue.filter(p => {
			const result = when?.(p) ?? true;

			if (result)
				this.flushPacket(p);

			return result;
		});
	}

	@Subscribe("sendPacket", Priority.FINAL_DECISION)
	private onPacket(pkt: CancelableWrapper<C2SPacket>) {
		const outcome = new PacketOutcome(pkt.data, Action.FLUSH);
		Bus.emit("queueC2SPacket", outcome);
		if (outcome.action === Action.FLUSH) {
			this.flush();
		}
	}
}
