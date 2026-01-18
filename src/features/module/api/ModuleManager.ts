import AntiBan from "../impl/blatant/AntiBan.js";
import Test from "../impl/utility/Test.js";
import type Mod from "./Module.js";
import type Category from "./Category.js";
import NoSlow from "../impl/blatant/NoSlow.js";
import Phase from "../impl/blatant/Phase.js";
import Scaffold from "../impl/blatant/Scaffold.js";
import AutoRespawn from "../impl/utility/AutoRespawn.js";
import FilterBypass from "../impl/utility/FilterBypass.js";

/** some basic predicates for finding modules */
export const P = {
	/** filters to find a specific module by the same name (`===` operator) */
	byName: (name: string) => (module: Mod) => module.name === name,
	/** filters to find a specific module in the same state (mod.enabled === enabled) */
	byEnabled: (enabled: boolean) => (module: Mod) =>
		module.enabled === enabled,
	/** filters to find a specific module by its category */
	byCategory: (category: Category) => (module: Mod) =>
		module.category === category,
};

export default class ModuleManager {
	// only important ish modules (ones that will get referenced in other modules)
	// should be as a variable instead of in the array
	public static antiBan = new AntiBan();
	public static noSlow = new NoSlow();
	public static phase = new Phase();

	constructor() {
		throw new Error("everything in module manager is static lol");
	}

	public static readonly modules: Mod[] = [
		new Test(),
		new AutoRespawn(),
		this.antiBan,
		this.noSlow,
		this.phase,
		new Scaffold(),
		new FilterBypass(),
	] as const;

	public static findModule(
		predicate: (module: Mod) => boolean,
	): Mod | undefined {
		return ModuleManager.modules.find(predicate);
	}

	public static findModules(predicate: (module: Mod) => boolean): Mod[] {
		return ModuleManager.modules.filter(predicate);
	}
}
