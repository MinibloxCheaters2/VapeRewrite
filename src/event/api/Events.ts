import type { C2SPacket, S2CPacket } from "../../features/sdk/types/packetTypes";
import type CancelableWrapper from "./CancelableWrapper";

type ClientEvents = {
	tick: void;
	render: void;
	sendPacket: CancelableWrapper<C2SPacket>;
	// TODO: should it be possible to cancel S2C packets?
	receivePacket: S2CPacket;
};

export default ClientEvents;
