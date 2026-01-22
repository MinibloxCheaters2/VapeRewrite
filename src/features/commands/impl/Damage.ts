import { argument, literal, FloatArgumentType } from "@wq2/brigadier-ts";
import dispatcher from "../api/CommandDispatcher";
import Refs from "../../../utils/refs";

dispatcher.register(literal("damage")
    .then(argument("amount", new FloatArgumentType())
    .executes(async e => {
        const amount = e.get("amount") as number;
		for (let i = 1; i < amount; i++) {
            Refs.game.controller.objectMouseOver.hitVec = Refs.player.pos.clone();
            Refs.game.controller.attackEntity(Refs.player);
		}
    }))
)
