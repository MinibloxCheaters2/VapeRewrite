import { argument, literal, StringArgumentType } from "@wq2/brigadier-ts";
import PacketRefs from "@/utils/network/packetRefs";
import Miniblox from "@/utils/refs/miniblox";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("say").then(
		argument("what", new StringArgumentType("greedy_phrase")).executes(async (e) => {
			const what = e.get<string>("what");
			Miniblox.ClientSocket.sendPacket(new PacketRefs.s.SPacketMessage({ text: what }));
		}),
	),
);
