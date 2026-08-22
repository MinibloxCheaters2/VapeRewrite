import HudManager from "@vape/core/features/hud/api/HudManager";

import ArrayListHud from "./impl/ArrayListHud";
import SpeedHud from "./impl/SpeedHud";
import TargetHud from "./impl/TargetHud";

// Register all HUD types
export function initHudSystem() {
	HudManager.registerHudType(ArrayListHud);
	HudManager.registerHudType(SpeedHud);
	HudManager.registerHudType(TargetHud);
}

export { default as BaseHudElement } from "@vape/core/features/hud/api/BaseHudElement";
export { default as CanvasHudElement } from "@vape/core/features/hud/api/CanvasHudElement";
export { default as JSXHudElement } from "@vape/core/features/hud/api/JSXHudElement";
export { HudManager };
