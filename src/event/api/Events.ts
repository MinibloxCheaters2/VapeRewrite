import type { C2SPacket, S2CPacket } from "@/features/sdk/types/packetTypes";
import { PacketOutcome } from "@/utils/packetQueueManager";
import type CancelableWrapper from "./CancelableWrapper";

type ClientEvents = {
	tick: void;
	render: void;
	sendPacket: CancelableWrapper<C2SPacket>;
	receivePacket: CancelableWrapper<S2CPacket>;
	queueC2SPacket: PacketOutcome<C2SPacket>;
};

export default ClientEvents;
