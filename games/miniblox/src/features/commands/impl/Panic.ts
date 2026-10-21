import { CommandDispatcher as dispatcher } from "@vape-rewrite/core";
import { ModuleManager } from "@vape-rewrite/core";
import { literal } from "@wq2/brigadier-ts";

import Miniblox from "@/utils/refs/miniblox";

dispatcher.register(
	literal("panic").executes(async () => {
		ModuleManager.instance.modules.forEach((m) => {
			m.enabled = false;
		});
		Miniblox.chat.addChat({
			text: "Disabled all modules!",
			color: "green",
		});
		return 1;
	}),
);
