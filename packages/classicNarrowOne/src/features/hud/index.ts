import HudManager from "@vape/core/src/features/hud/api/HudManager";

import ArrayListHud from "./impl/ArrayListHud";
import SpeedHud from "./impl/SpeedHud";

// Register all HUD types
export function initHudSystem() {
	HudManager.registerHudType(ArrayListHud);
	HudManager.registerHudType(SpeedHud);
}

export { default as BaseHudElement } from "@vape/core/src/features/hud/api/BaseHudElement";
export { default as CanvasHudElement } from "@vape/core/src/features/hud/api/CanvasHudElement";
export { default as JSXHudElement } from "@vape/core/src/features/hud/api/JSXHudElement";
export { HudManager };
