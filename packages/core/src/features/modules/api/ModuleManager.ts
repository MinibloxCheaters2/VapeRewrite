import type Category from "./Category.js";
import type Mod from "./Module.js";

/** some basic predicates for finding modules */
export const P = {
	/**
	 * Filters to find a specific module by the same name (`===` operator).
	 * If you need to reference another module, use `ModuleManager.<name>`.
	 * It is more performant to get a field from the ModuleManager
	 * than to iterate over all modules and find one with the same name (O(1) for getting a field vs O(n) for iteration).
	 */
	byName: (name: string) => (module: Mod) => module.name === name,
	/** filters to find a specific module in the same state (mod.enabled === enabled) */
	byEnabled: (enabled: boolean) => (module: Mod) => module.enabled === enabled,
	/** filters to find a specific module by its category */
	byCategory: (category: Category) => (module: Mod) => module.category === category,
};

/**
 * Generic, instance-based module manager.
 *
 * `T` is a record of **named** module instances that other code can
 * reference directly (e.g. `ModuleManager.antiBan`).
 *
 * The game-specific package creates its own instance:
 * ```ts
 * import { ModuleManager, setModuleManager } from "@vape/core/features/modules/api/ModuleManager";
 * const instance = new ModuleManager<MinibloxModules>({
 *   named: { antiBan, noSlow, phase, scaffold, hudManager },
 *   modules: [...allModules],
 * });
 * setModuleManager(instance);
 * ```
 */
export class ModuleManager<const T extends object> {
	public readonly named: T;

	/** Every registered module. */
	public readonly modules: readonly Mod[];

	/** Each module's name. */
	public readonly moduleNames: string[];

	constructor({ named, modules }: { named: T; modules: Mod[] }) {
		this.named = named;
		this.modules = modules;
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

let _instance: ModuleManager<any> | null = null;

/**
 * Register the active ModuleManager instance.
 * Must be called once at startup before any consumer accesses `ModuleManager`.
 */
export function setModuleManager(instance: ModuleManager<any>): void {
	_instance = instance;
}

// ── Default export: Proxy that delegates to the live instance ───────

/**
 * Convenience proxy that forwards every property access / call
 * to the currently-registered {@link ModManager} instance.
 *
 * Named modules are also accessible directly:
 * `ModuleManager.antiBan` resolves to `instance.named.antiBan`.
 */
const ModManager = new Proxy({} as ModuleManager<object>, {
	get(_target, prop, receiver) {
		if (prop === Symbol.toPrimitive || prop === Symbol.toStringTag) {
			return undefined;
		}
		if (!_instance) {
			throw new Error(
				`ModuleManager not initialised yet. Accessing "${String(prop)}" before setModuleManager() was called.`,
			);
		}
		// 1. Try the instance itself (modules, findModule, findModules, moduleNames, named)
		if (prop in _instance) {
			return Reflect.get(_instance, prop, receiver);
		}
		// 2. Fall through to named modules: ModuleManager.antiBan → instance.named.antiBan
		if (typeof prop === "string" && prop in (_instance.named as object)) {
			return (_instance.named as any)[prop];
		}
		return undefined;
	},
});

export default ModManager;
