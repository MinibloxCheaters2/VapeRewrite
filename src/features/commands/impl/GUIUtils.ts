import { literal } from "@wq2/brigadier-ts";
import ModuleManager from "@/features/modules/api/ModuleManager";
import Refs from "@/utils/refs";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
    literal("enchant").executes(async (ctx) => {
        Refs.game.displayGui({
            getGuiID() {
                return "enchanting_table";
            }
        })
    }),
);

dispatcher.register(
    literal("craft").executes(async (ctx) => {
        Refs.game.displayGui({
            getGuiID() {
                return "workbench";
            }
        })
    }),
);


