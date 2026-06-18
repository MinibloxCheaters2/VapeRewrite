import HudManager from "./api/HudManager";
import ArrayListHud from "./impl/ArrayListHud";
import SpeedHud from "./impl/SpeedHud";
import TargetHud from "./impl/TargetHud";

// Register all HUD types
export function initHudSystem() {
	HudManager.registerHudType(ArrayListHud);
	HudManager.registerHudType(SpeedHud);
	HudManager.registerHudType(TargetHud);
}

export { default as BaseHudElement } from "./api/BaseHudElement";
export { default as CanvasHudElement } from "./api/CanvasHudElement";
export { default as JSXHudElement } from "./api/JSXHudElement";
export { HudManager };
