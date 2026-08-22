import type LegitModule from "./LegitModule";

export default class LegitModuleManager {
	private constructor() {
		throw new Error("everything in LegitModuleManager is static lol");
	}

	/** All registered legit modules, kept sorted alphabetically. */
	public static readonly modules: LegitModule[] = [];

	/**
	 * Register a legit module instance.
	 * Modules are kept sorted by name, matching the Lua reference behavior.
	 */
	public static add(mod: LegitModule): LegitModule {
		LegitModuleManager.modules.push(mod);
		LegitModuleManager.modules.sort((a, b) => a.name.localeCompare(b.name));
		return mod;
	}

	/** Find a legit module by name. */
	public static find(name: string): LegitModule | undefined {
		return LegitModuleManager.modules.find((m) => m.name === name);
	}
}
