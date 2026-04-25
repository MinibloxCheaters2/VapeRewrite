import { argument, literal, StringArgumentType } from "@wq2/brigadier-ts";
import Refs from "@/utils/helpers/refs";
import PacketRefs from "@/utils/network/packetRefs";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("say").then(
		argument("what", new StringArgumentType("greedy_phrase")).executes(
			async (e) => {
				const what = e.get<string>("what");
				Refs.ClientSocket.sendPacket(
					new PacketRefs.s.SPacketMessage({ text: what }),
				);
			},
		),
	),
);
