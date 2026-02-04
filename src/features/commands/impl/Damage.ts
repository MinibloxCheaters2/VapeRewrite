import { argument, IntegerArgumentType, literal } from "@wq2/brigadier-ts";
import Refs from "@/utils/refs";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("damage").then(
		argument("amount", new IntegerArgumentType()).executes(async (e) => {
			const amount = e.get<number>("amount");
			for (let i = 1; i < amount; i++) {
				Refs.game.controller.objectMouseOver.hitVec =
					Refs.player.pos.clone();
				Refs.game.controller.attackEntity(Refs.player);
				Refs.game.chat.addChat({
					text: "Dealt " + amount + " damage!",
					color: "blue"
				});
			}
		}),
	),
);
