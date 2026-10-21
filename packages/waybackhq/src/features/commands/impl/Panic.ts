import { CommandDispatcher as dispatcher } from "@vape/core";
import { ModuleManager } from "@vape/core";
import { literal } from "@wq2/brigadier-ts";

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
