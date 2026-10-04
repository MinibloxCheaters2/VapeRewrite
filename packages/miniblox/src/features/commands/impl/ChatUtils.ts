import dispatcher from "@vape/core/features/commands/api/CommandDispatcher";
import { literal } from "@wq2/brigadier-ts";

import Miniblox from "@/utils/refs/miniblox";

dispatcher.register(
	literal("clear").executes(async () => {
		Miniblox.chat.clear();
	}),
);
