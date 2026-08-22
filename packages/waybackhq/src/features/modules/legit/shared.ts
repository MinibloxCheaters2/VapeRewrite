import type LegitModule from "../api/LegitModule";

import LegitModuleManager from "@vape/core/features/modules/api/LegitModuleManager";

export function register<T extends LegitModule>(mod: T): T {
	LegitModuleManager.add(mod);
	return mod;
}
