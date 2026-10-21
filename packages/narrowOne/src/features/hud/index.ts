import { HudManager } from "@vape/core";

import ArrayListHud from "./impl/ArrayListHud";
import SpeedHud from "./impl/SpeedHud";

// Register all HUD types
export function initHudSystem() {
	HudManager.registerHudType(ArrayListHud);
	HudManager.registerHudType(SpeedHud);
}

export { BaseHudElement } from "@vape/core";
export { CanvasHudElement } from "@vape/core";
export { JSXHudElement } from "@vape/core";
export { HudManager };
