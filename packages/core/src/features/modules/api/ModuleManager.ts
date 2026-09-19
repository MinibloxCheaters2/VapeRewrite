import type Category from "./Category.js";
import type Mod from "./Module.js";

/** some basic predicates for finding modules */
export const P = {
	/**
	 * Filters to find a specific module by the same name (`===` operator).
	 */
	byName: (name: string) => (module: Mod) => module.name === name,
	/** filters to find a specific module in the same state (mod.enabled === enabled) */
	byEnabled: (enabled: boolean) => (module: Mod) => module.enabled === enabled,
	/** filters to find a specific module by its category */
	byCategory: (category: Category) => (module: Mod) => module.category === category,
};

export default class ModuleManager {
	/** Each module's name. */
	public readonly moduleNames: string[];

	public static get instance() {
		if (!_instance) {
			debugger;
			throw new Error("ModManager accessed before create(...) called");
		};
		return _instance;
	}

	constructor(public readonly modules: Mod[]) {
		this.moduleNames = modules.map((m) => m.name);
	}

	/**
	 * Finds a module that matches the given predicate.
	 * @param predicate The predicate to match modules against.
	 * @returns The module that matches the predicate, or undefined if no module matches.
	 */
	findModule(predicate: (module: Mod) => boolean): Mod | undefined {
		return this.modules.find(predicate);
	}

	/**
	 * Finds all modules that match the given predicate.
	 * @param predicate The predicate to match modules against.
	 * @returns An array of modules that match the predicate.
	 */
	findModules(predicate: (module: Mod) => boolean): Mod[] {
		return this.modules.filter(predicate);
	}
}

// ── Singleton registry ──────────────────────────────────────────────

let _instance: ModuleManager | null = null;

/**
 * Register the active ModuleManager instance.
 * Must be called once at startup before any consumer accesses `ModuleManager`.
 */
export function create(...modules: Mod[]): void {
	_instance = new ModuleManager(modules);
}
