import { argument, literal } from "@wq2/brigadier-ts";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import dispatcher from "../api/CommandDispatcher";
import PlayerArgumentType from "../api/brigadier/PlayerArgumentType";



dispatcher.register(
    literal("locate").then(
        argument("player", new PlayerArgumentType()).executes(async (e) => {
            const playeru = e.get<any>("player");
            let players = Refs.game.world.players;
            for (let p of players) {
                if(p[1].profile.username == playeru){
                    Refs.game.chat.addChat({
                        text: `${playeru} is at ${Math.round(p[1].pos.x).toString()}, ${Math.round(p[1].pos.y).toString()}, ${Math.round(p[1].pos.z).toString()}`,
                        color: "blue"
                    })
                    return;
                }
            }
            Refs.game.chat.addChat({
                text: `Could not find player ${playeru}`,
                color: "red"
            })
    )
)
);