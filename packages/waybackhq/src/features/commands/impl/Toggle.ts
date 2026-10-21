import type { Mod } from "@vape-rewrite/core";

import { CommandDispatcher as dispatcher } from "@vape-rewrite/core";
import { argument, literal } from "@wq2/brigadier-ts";

// import Miniblox from "@/utils/refs/miniblox";

import { ModuleArgumentType } from "@vape-rewrite/core";

dispatcher.register(
	literal("toggle").then(
		argument("module", new ModuleArgumentType()).executes(async (e) => {
			const m = e.get<Mod>("module");
			// Miniblox.chat.addChat({
			// 	text: `Toggled module ${m.name} ${m.enabled ? "off" : "on"}!`,
			// 	color: m.enabled ? "red" : "blue",
			// });
			return m.toggle();
		}),
	),
);
