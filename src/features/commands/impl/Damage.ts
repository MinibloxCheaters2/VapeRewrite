import { argument, IntegerArgumentType, literal } from "@wq2/brigadier-ts";
import Miniblox from "@/utils/refs/miniblox";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("damage").then(
		argument("amount", new IntegerArgumentType()).executes(async (e) => {
			const amount = e.get<number>("amount");
			for (let i = 1; i < amount; i++) {
				Miniblox.game.controller.objectMouseOver.hitVec =
					Miniblox.player.pos.clone();
				Miniblox.playerController.attackEntity(Miniblox.player);
			}
			Miniblox.chat.addChat({
				text: `Dealt ${amount} damage!`,
				color: "blue",
			});
		}),
	),
);
