import type { LegitModule } from "@vape/core";

import { LegitModuleManager } from "@vape/core";

export function register<T extends LegitModule>(mod: T): T {
	LegitModuleManager.add(mod);
	return mod;
}
