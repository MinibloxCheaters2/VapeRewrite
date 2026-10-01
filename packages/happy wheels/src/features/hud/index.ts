import HudManager from "@vape/core/features/hud/api/HudManager";

import ArrayListHud from "./impl/ArrayListHud";

// Register all HUD types
export function initHudSystem() {
	HudManager.registerHudType(ArrayListHud);
}

export { HudManager };
