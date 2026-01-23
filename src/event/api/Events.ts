import type { C2SPacket, S2CPacket } from "../../features/sdk/types/packetTypes";
import type CancelableWrapper from "./CancelableWrapper";

type ClientEvents = {
	tick: void;
	render: void;
	sendPacket: CancelableWrapper<C2SPacket>;
	receivePacket: CancelableWrapper<S2CPacket>;
};

export default ClientEvents;
