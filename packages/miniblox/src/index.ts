import "@vape/core/meta.js?userscript-metadata";
import "./meta.js?userscript-metadata";
import "@vape/core/exposed";
import "./hooks";
import "./utils/refs";
import "./utils/network/WasmTest";
import "./hooks/init";
import "./features/modules/legit";
import "./features/commands/Listener";
import "./utils/network/packetQueueManager";
import "./utils/aiming/rotate";
import "./features/modules/registry";
import "@vape/core/features/binds/handler";
import "./utils/movement/ServerFallDistance";
import { initApp } from "@vape/core/ui/app";

import { initHudSystem } from "@/features/hud";
import { waitForReact } from "@/utils/helpers/waitForReact";

waitForReact().then(() => {
	initHudSystem();
	initApp();
});
