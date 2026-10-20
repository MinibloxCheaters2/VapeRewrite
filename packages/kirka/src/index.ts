import "@vape/core/src/meta.js?userscript-metadata";
import "@vape/core/src/types/vm.d.ts";
import "./meta.js?userscript-metadata";
import "./ModuleManager";
import "./Bus";
import "./utils/refs/game";
import "@vape/core/src/exposed";
import "./hooks/init";
import "@vape/core/src/features/binds/handler";
import { initApp } from "@vape/ui";

import { initHudSystem } from "@/features/hud";
initApp();
initHudSystem();
