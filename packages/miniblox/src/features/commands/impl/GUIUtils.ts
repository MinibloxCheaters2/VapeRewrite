import dispatcher from "@vape/core/features/commands/api/CommandDispatcher";
import { literal } from "@wq2/brigadier-ts";

import Miniblox from "@/utils/refs/miniblox";

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
