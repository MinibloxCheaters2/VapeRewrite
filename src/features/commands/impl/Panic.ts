import { argument, literal } from "@wq2/brigadier-ts";
import ModuleManager from "@/features/modules/api/ModuleManager";
import ModuleArgumentType from "../api/brigadier/ModuleArgumentType";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
    literal("panic")
        .executes(async () => {
            ModuleManager.disableAll();
            return 1;
        })
);
