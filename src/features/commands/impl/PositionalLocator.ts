import { argument, literal } from "@wq2/brigadier-ts";
import Bus from "@/Bus";
import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { EntityPlayer } from "@/features/sdk/types/entity";
import type { S2CPacket } from "@/features/sdk/types/packetTypes";
import { s2c } from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import PlayerArgumentType from "../api/brigadier/PlayerArgumentType";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("locate").then(
		argument("player", new PlayerArgumentType()).executes(async (e) => {
			const player = e.get<EntityPlayer>("player");
			Refs.chat.addChat({
				text: `${player.name} is at ${Math.round(player.pos.x)}, ${Math.round(
					player.pos.y,
				)}, ${Math.round(player.pos.z)}`,
				color: "blue",
			});
		}),
	),
);

// biome-ignore lint/correctness/noUnusedVariables: one day it will be used
class PlayerInfoLocator {
	constructor() {
		Bus.registerSubscriber(this);
	}
	@Subscribe("receivePacket")
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: the annotation uses it
	#onRecvPacket(e: CancelableWrapper<S2CPacket>) {
		const { data: packet } = e;
		if (packet instanceof s2c("CPacketMessage")) {
		}
	}
}
