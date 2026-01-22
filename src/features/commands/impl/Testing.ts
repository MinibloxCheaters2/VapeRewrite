import { argument, bool, literal } from "@wq2/brigadier-ts";
import dispatcher from "../api/CommandDispatcher";
import ModuleArgumentType from "../api/brigadier/ModuleArgumentType";

dispatcher.register(literal("test")
    .then(literal("ab").executes(async _ => {}))
    .then(literal("bcd").executes(async _ => {}))
    .then(literal("efg").executes(async _ => {}))
    .then(literal("hij").executes(async _ => {}))
    .then(literal("klm").executes(async _ => {}))
    .then(literal("b").then(argument("boolean", bool())).executes(async _ => {}))
	.then(literal("m").then(argument("module", new ModuleArgumentType())).executes(async _ => {}))
    .executes(async _ => {
    })
);
