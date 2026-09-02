import Cancelable from "@vape/core/event/Cancelable";
import CancelableWrapper from "@vape/core/event/CancelableWrapper";
import { PACKET } from "@wq2/waybackhq-types/src/net/protocol";
import { DecodedVelocity, TeleportTarget } from "@wq2/waybackhq-types/src/net/session";

import { AnyPacket } from "./hooks/packetHook";

type ClientEvents = {
	gameTick: void;
	playerTick: Cancelable;
	teleport: CancelableWrapper<TeleportTarget>;
	velocity: CancelableWrapper<{
		entityID: number;
		x: number;
		y: number;
		z: number;
	}>;
	sendPacket: CancelableWrapper<AnyPacket>;
	receivePacket: CancelableWrapper<AnyPacket>;
	// connect: void; // requires session hook, and unused.
	join: void;
};

export default ClientEvents;
