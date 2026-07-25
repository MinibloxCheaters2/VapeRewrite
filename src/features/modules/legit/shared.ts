import type LegitModule from "../api/LegitModule";
import LegitModuleManager from "../api/LegitModuleManager";

export function register<T extends LegitModule>(mod: T): T {
	LegitModuleManager.add(mod);
	return mod;
}
