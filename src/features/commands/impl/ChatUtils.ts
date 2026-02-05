import { argument, literal, StringArgumentType } from "@wq2/brigadier-ts";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
    literal("clear").executes(
        async () => {
            Refs.chat.clear();
            return 1;
        }
    )
)

