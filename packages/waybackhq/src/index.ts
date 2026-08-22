import "@vape/core/meta.js?userscript-metadata";
import "./meta.js?userscript-metadata";
import "./ModuleManager";
import "./Bus";
import "@vape/core/exposed";
import "./hooks/init";
import "@vape/core/features/binds/handler";
import { initApp } from "@vape/core/ui/app";

import { initHudSystem } from "@/features/hud";
initApp();
initHudSystem();
