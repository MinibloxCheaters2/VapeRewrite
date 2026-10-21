import "@vape-rewrite/core/meta.js?userscript-metadata";
import "./meta.js?userscript-metadata";
import "@vape-rewrite/core/src/types/vm.d.ts";
import "@vape-rewrite/core";
import "./hooks";
import "./utils/refs";
import "./utils/network/WasmTest";
import "./hooks/init";
import "./features/modules/legit";
import "./features/commands/Listener";
import "./features/commands/CommandManager";
import "./utils/network/packetQueueManager";
import "./utils/aiming/rotate";
import "./features/modules/registry";
import "./utils/movement/ServerFallDistance";
import { initApp } from "@vape-rewrite/ui";

import { initHudSystem } from "@/features/hud";
import waitUntilReady from "./utils/helpers/waitUntilReady";

waitUntilReady().then(() => {
	initHudSystem();
	initApp();
});
