import { argument, literal, StringArgumentType } from "@wq2/brigadier-ts";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("say").then(
		argument("what", new StringArgumentType("greedy_phrase")).executes(
			async (e) => {
				const what = e.get<string>("what");
				Refs.ClientSocket.sendPacket(
					new (PacketRefs.getRef("SPacketMessage"))({ text: what }),
				);
			},
		),
	),
);
