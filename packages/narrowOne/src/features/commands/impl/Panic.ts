import dispatcher from "@vape/core/features/commands/api/CommandDispatcher";
import ModuleManager from "@vape/core/features/modules/api/ModuleManager";
import { literal } from "@wq2/brigadier-ts";

import Miniblox from "@/utils/refs/miniblox";

dispatcher.register(
	literal("panic").executes(async () => {
		ModuleManager.modules.forEach((m) => {
			m.enabled = false;
		});
		Miniblox.chat.addChat({
			text: "Disabled all modules!",
			color: "green",
		});
		return 1;
	}),
);
