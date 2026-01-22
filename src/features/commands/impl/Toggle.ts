import { argument, literal } from "@wq2/brigadier-ts";
import dispatcher from "../api/CommandDispatcher";
import ModuleArgumentType from "../api/brigadier/ModuleArgumentType";
import Mod from "../../module/api/Module";

dispatcher.register(literal("toggle")
	.then(argument("module", new ModuleArgumentType()))
	.executes(async e => {
		const m = e.get("module") as Mod;
		return m.toggle();
	})
)
