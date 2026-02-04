import { argument, literal, StringArgumentType } from "@wq2/brigadier-ts";
import type Mod from "@/features/modules/api/Module";
import ModuleArgumentType from "../api/brigadier/ModuleArgumentType";
import dispatcher from "../api/CommandDispatcher";
import Refs from "@/utils/refs";

dispatcher.register(
	literal("bind").then(
		argument("module", new ModuleArgumentType()).then(
			argument("to", new StringArgumentType("single_word")).executes(
				async (e) => {
					const m = e.get<Mod>("module");
					const to = e.get<string>("to").toLowerCase();
					const actual = to === "none" ? "" : to;
					// the setter handles the setting logic.
					m.bind = actual;
					Refs.game.chat.addChat({
					text: "Bound " + m.name + " to " + (actual || "none") + "!",
					color: "aqua"
				});
				},
			),
		),
	),
);
