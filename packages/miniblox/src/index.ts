import "@vape/core/meta.js?userscript-metadata";
import "./meta.js?userscript-metadata";
import "@vape/core/src/types/vm.d.ts";
import "@vape/core";
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
import { initApp } from "@vape/ui";

import { initHudSystem } from "@/features/hud";
import waitUntilReady from "./utils/helpers/waitUntilReady";

waitUntilReady().then(() => {
	initHudSystem();
	initApp();
});
