import { argument, literal } from "@wq2/brigadier-ts";
import type { EntityPlayer } from "@/features/sdk/types/entity";
import Refs from "@/utils/refs";
import PlayerArgumentType from "../api/brigadier/PlayerArgumentType";
import dispatcher from "../api/CommandDispatcher";
import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import PacketRefs from "@/utils/packetRefs";


dispatcher.register(
	literal("locate").then(
		argument("player", new PlayerArgumentType()).executes(async (e) => {
			const player = e.get<EntityPlayer>("player");
			Refs.game.chat.addChat({
				text: `${player.name} is at ${Math.round(player.pos.x).toString()}, ${Math.round(player.pos.y).toString()}, ${Math.round(player.pos.z).toString()}`,
				color: "blue",
			});
		}),
	),
);

