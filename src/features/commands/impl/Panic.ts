import { literal } from "@wq2/brigadier-ts";
import ModuleManager from "@/features/modules/api/ModuleManager";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("panic").executes(async () => {
		ModuleManager.modules.forEach((m) => {
			m.enabled = false;
		});
		return 1;
	}),
);
