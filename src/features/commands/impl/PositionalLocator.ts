import { argument, literal } from "@wq2/brigadier-ts";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import dispatcher from "../api/CommandDispatcher";
import PlayerArgumentType from "../api/brigadier/PlayerArgumentType";



dispatcher.register(
    literal("locate").then(
        argument("player", new PlayerArgumentType()).executes(async (e) => {
            const playeru = e.get<any>("player");
            for (let i of Refs.game.world.players) {
                if(i[1].profile.username == playeru.name){
                    Refs.game.chat.addChat({
                        text: `${playeru.name} is at ${Math.round(i[1].pos.x).toString()}, ${Math.round(i[1].pos.y).toString()}, ${Math.round(i[1].pos.z).toString()}`,
                        color: "blue"
                    })
                    return;
                }
            }
            Refs.game.chat.addChat({
                text: `Could not find player ${playeru.name}`,
                color: "red"
            })
    })
    ),
)
