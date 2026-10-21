import "@vape/core/meta.js?userscript-metadata";
import "@vape/core/src/types/vm.d.ts";
import "./meta.js?userscript-metadata";
import "./ModuleManager";
import "./Bus";
import "./utils/refs/game";
import "@vape/core";
import "./hooks/init";
import { initApp } from "@vape/ui";

import { initHudSystem } from "@/features/hud";
initApp();
initHudSystem();
