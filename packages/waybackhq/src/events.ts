import Cancelable from "@vape/core/event/Cancelable";
import CancelableWrapper from "@vape/core/event/CancelableWrapper";
import { TeleportTarget } from "@wq2/waybackhq-types/src/net/session";

import { AnyPacket } from "./hooks/packetHook";
import { PacketOutcome } from "./utils/network/packetQueueManager";

type ClientEvents = {
	gameTick: void;
	playerTick: Cancelable;
	livingUpdate: Cancelable;
	afterLivingUpdate: void;
	teleport: CancelableWrapper<TeleportTarget>;
	velocity: CancelableWrapper<{
		entityID: number | undefined;
		x: number;
		y: number;
		z: number;
	}>;
	sendPacket: CancelableWrapper<AnyPacket>;
	receivePacket: CancelableWrapper<AnyPacket>;
	queueC2SPacket: PacketOutcome<AnyPacket>;
	// connect: void; // requires session hook, and unused.
	join: void;
};

export default ClientEvents;
