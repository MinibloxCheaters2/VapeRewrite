import HudManager from "./api/HudManager";
import ArrayListHud from "./impl/ArrayListHud";
import CPSHud from "./impl/CPSHud";
import FPSHud from "./impl/FPSHud";
import KeystrokesHud from "./impl/KeystrokesHud";

// Register all HUD types
export function initHudSystem() {
	HudManager.registerHudType(ArrayListHud);
	HudManager.registerHudType(FPSHud);
	HudManager.registerHudType(CPSHud);
	HudManager.registerHudType(KeystrokesHud);
}

export { default as BaseHudElement } from "./api/BaseHudElement";
export { default as CanvasHudElement } from "./api/CanvasHudElement";
export { default as JSXHudElement } from "./api/JSXHudElement";
export { HudManager };
