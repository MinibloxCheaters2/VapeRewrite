import { CommandDispatcher as dispatcher } from "@vape/core";
import { literal } from "@wq2/brigadier-ts";

import Miniblox from "@/utils/refs/miniblox";

dispatcher.register(
	literal("clear").executes(async () => {
		Miniblox.chat.clear();
	}),
);
