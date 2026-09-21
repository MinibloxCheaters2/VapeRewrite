import dispatcher from "@vape/core/features/commands/api/CommandDispatcher";
import { argument, literal, StringArgumentType } from "@wq2/brigadier-ts";

import PacketRefs from "@/utils/network/packetRefs";
import Miniblox from "@/utils/refs/miniblox";

dispatcher.register(
	literal("say").then(
		argument("what", new StringArgumentType("greedy_phrase")).executes(async (e) => {
			const what = e.get<string>("what");
			Miniblox.ClientSocket.sendPacket(new PacketRefs.s.SPacketMessage({ text: what }));
		}),
	),
);
