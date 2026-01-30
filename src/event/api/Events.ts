import type { C2SPacket, S2CPacket } from "@/features/sdk/types/packetTypes";
import type { PacketOutcome } from "@/utils/packetQueueManager";
import type CancelableWrapper from "./CancelableWrapper";

type ClientEvents = {
	/** biome-ignore lint/suspicious/noConfusingVoidType: void is used as an empty type for 0-parameter events. */
	tick: void;
	/** biome-ignore lint/suspicious/noConfusingVoidType: void is used as an empty type for 0-parameter events. */
	render: void;
	sendPacket: CancelableWrapper<C2SPacket>;
	receivePacket: CancelableWrapper<S2CPacket>;
	queueC2SPacket: PacketOutcome<C2SPacket>;
};

export default ClientEvents;
