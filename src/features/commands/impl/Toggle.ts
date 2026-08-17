import { argument, literal } from "@wq2/brigadier-ts";
import type Mod from "@/features/modules/api/Module";
import Miniblox from "@/utils/refs/miniblox";
import ModuleArgumentType from "../api/brigadier/ModuleArgumentType";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("toggle").then(
		argument("module", new ModuleArgumentType()).executes(async (e) => {
			const m = e.get<Mod>("module");
			Miniblox.chat.addChat({
				text: `Toggled module ${m.name} ${m.enabled ? "off" : "on"}!`,
				color: m.enabled ? "red" : "blue",
			});
			return m.toggle();
		}),
	),
);
