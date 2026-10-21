import { HudManager } from "@vape-rewrite/core";

import ArrayListHud from "./impl/ArrayListHud";
import SpeedHud from "./impl/SpeedHud";
import TargetHud from "./impl/TargetHud";

// Register all HUD types
export function initHudSystem() {
	HudManager.registerHudType(ArrayListHud);
	HudManager.registerHudType(SpeedHud);
	HudManager.registerHudType(TargetHud);
}

export { BaseHudElement } from "@vape-rewrite/core";
export { CanvasHudElement } from "@vape-rewrite/core";
export { JSXHudElement } from "@vape-rewrite/core";
export { HudManager };
