import type LegitModule from "@vape/core/src/features/modules/api/LegitModule";

import LegitModuleManager from "@vape/core/src/features/modules/api/LegitModuleManager";

export function register<T extends LegitModule>(mod: T): T {
	LegitModuleManager.add(mod);
	return mod;
}
