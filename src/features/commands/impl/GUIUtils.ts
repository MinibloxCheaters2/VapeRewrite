import { literal } from "@wq2/brigadier-ts";
import Refs from "@/utils/refs";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("enchant").executes(async (_) => {
		Refs.game.player.displayGui({
			getGuiID() {
				return "enchanting_table";
			},
		});
	}),
);

dispatcher.register(
	literal("craft").executes(async (_) => {
		Refs.game.player.displayGui({
			getGuiID() {
				return "workbench";
			},
		});
	}),
);
