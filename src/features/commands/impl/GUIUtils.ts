import { literal } from "@wq2/brigadier-ts";
import Miniblox from "@/utils/refs/miniblox";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("enchant").executes(async (_) => {
		Miniblox.game.player.displayGui({
			getGuiID() {
				return "enchanting_table";
			},
		});
	}),
);

dispatcher.register(
	literal("craft").executes(async (_) => {
		Miniblox.game.player.displayGui({
			getGuiID() {
				return "workbench";
			},
		});
	}),
);
