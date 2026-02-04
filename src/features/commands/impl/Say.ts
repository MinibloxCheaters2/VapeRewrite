import { argument, StringArgumentType, literal } from "@wq2/brigadier-ts";
import Refs from "@/utils/refs";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("say").then(
		argument("what", new StringArgumentType()).executes(async (e) => {
			const what = e.get<string>("what");
            Refs.ClientSocket.sendPacket(new (PacketRefs.getRef("SPacketMessage")({text: what})));
		}),
	),
);
