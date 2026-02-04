import { literal } from "@wq2/brigadier-ts";
import ModuleManager from "@/features/modules/api/ModuleManager";
import Refs from "@/utils/refs";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("panic").executes(async () => {
		ModuleManager.modules.forEach((m) => {
			m.enabled = false;
		});
		Refs.game.chat.addChat({
			text: "Disabled all modules!",
			color: "green",
		});
		return 1;
	}),
);
