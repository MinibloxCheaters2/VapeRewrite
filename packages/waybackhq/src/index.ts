import "@vape-rewrite/core/meta.js?userscript-metadata";
import "@vape-rewrite/core/src/types/vm.d.ts";
import "./meta.js?userscript-metadata";
import "./ModuleManager";
import "./Bus";
import "@vape-rewrite/core";
import "./hooks/init";
import "./utils/network/packetQueueManager";
import "./utils/aiming/rotate";
import { initApp } from "@vape-rewrite/ui";

import { initHudSystem } from "@/features/hud";
initApp();
initHudSystem();
