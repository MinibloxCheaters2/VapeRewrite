import { argument, literal, FloatArgumentType } from "brigadier-ts";
import dispatcher from "../api/CommandDispatcher";
import Refs from "../../sdk/api/refs";

dispatcher.register(literal("damage")
    .then(argument("amount", new FloatArgumentType()))
    .executes(e => {
        const amount = e.get("amount") as number;
        Array.from({length: amount}).forEach(() => {
            Refs.game.controller.objectMouseOver.hitVec = Refs.player.pos.clone();
            Refs.game.controller.attack();
        });
        return 0;
    })
)
