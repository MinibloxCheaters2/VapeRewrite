import "@vape/core/meta.js?userscript-metadata";
import "@vape/core/types/vm.d.ts";
import "./meta.js?userscript-metadata";
import "./ModuleManager";
import "./Bus";
import "./utils/refs/game";
import "@vape/core/exposed";
import "./hooks/init";
import "@vape/core/features/binds/handler";
import { initApp } from "@vape/core/ui/app";

import { initHudSystem } from "@/features/hud";
initApp();
initHudSystem();
