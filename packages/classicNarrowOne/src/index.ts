import "@vape/core/src/meta.js?userscript-metadata";
import "@vape/core/src/types/vm.d.ts";
import "./meta.js?userscript-metadata";
import "./ModuleManager";
import "./Bus";
import "@vape/core";
import "./hooks/init";
import { initApp } from "@vape/ui";

import { initHudSystem } from "@/features/hud";
initApp();
initHudSystem();
