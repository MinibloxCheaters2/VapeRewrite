import Criticals from "../impl/combat/Criticals.js";
import KillAura from "../impl/combat/KillAura.js";
import TargetStrafe from "../impl/combat/TargetStrafe.js";
import Velocity from "../impl/combat/Velocity.js";
import WTap from "../impl/combat/WTap.js";
import Fly from "../impl/movement/Fly.js";
import NoSlow from "../impl/movement/NoSlow.js";
import Phase from "../impl/movement/Phase.js";
import HudManagerModule from "../impl/render/HudManager.js";
import AntiBan from "../impl/utility/AntiBan.js";
import AutoRespawn from "../impl/utility/AutoRespawn.js";
import Blink from "../impl/utility/Blink.js";
import FakeLag from "../impl/utility/FakeLag.js";
import FilterBypass from "../impl/utility/FilterBypass.js";
import RejoinOnMute from "../impl/utility/RejoinOnMute.js";
import ServerCrasher from "../impl/utility/ServerCrasher.js";
import NoFall from "../impl/world/NoFall.js";
import Scaffold from "../impl/world/Scaffold.js";
import type Category from "./Category.js";
import type Mod from "./Module.js";

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
	public static readonly antiBan = new AntiBan();
	public static readonly noSlow = new NoSlow();
	public static readonly phase = new Phase();
	public static readonly scaffold = new Scaffold();
	public static readonly hudManager = new HudManagerModule();

	constructor() {
		throw new Error("everything in module manager is static lol");
	}

	public static readonly modules: Mod[] = [
		new AutoRespawn(),
		this.antiBan,
		this.noSlow,
		this.phase,
		this.scaffold,
		new FilterBypass(),
		new Fly(),
		new ServerCrasher(),
		new KillAura(),
		new Velocity(),
		new NoFall(),
		new Criticals(),
		new TargetStrafe(),
		new RejoinOnMute(),
		new WTap(),
		new Blink(),
		new FakeLag(),
		this.hudManager,
	] as const;

	public static readonly moduleNames: string[] = this.modules.map(
		(m) => m.name,
	);

	public static findModule(
		predicate: (module: Mod) => boolean,
	): Mod | undefined {
		return ModuleManager.modules.find(predicate);
	}

	public static findModules(predicate: (module: Mod) => boolean): Mod[] {
		return ModuleManager.modules.filter(predicate);
	}
}
