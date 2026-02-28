import Blink from "../impl/blatant/Blink.js";
import FakeLag from "../impl/blatant/FakeLag.js";
import Fly from "../impl/blatant/Fly.js";
import KillAura from "../impl/blatant/KillAura.js";
import NoSlow from "../impl/blatant/NoSlow.js";
import Phase from "../impl/blatant/Phase.js";
import Scaffold from "../impl/blatant/Scaffold.js";
import Spider from "../impl/blatant/Spider.js";
import TargetStrafe from "../impl/blatant/TargetStrafe.js";
import TickBase from "../impl/blatant/TickBase.js";
import Criticals from "../impl/combat/Criticals.js";
import Velocity from "../impl/combat/Velocity.js";
import WTap from "../impl/combat/WTap.js";
import HudManagerModule from "../impl/render/HudManager.js";
import AntiBan from "../impl/utility/AntiBan.js";
import AutoRespawn from "../impl/utility/AutoRespawn.js";
import AutoSword from "../impl/utility/AutoSword.js";
import ChestAura from "../impl/utility/ChestAura.js";
import ChestStealer from "../impl/utility/ChestStealer.js";
import FilterBypass from "../impl/utility/FilterBypass.js";
import RejoinOnMute from "../impl/utility/RejoinOnMute.js";
import ServerCrasher from "../impl/utility/ServerCrasher.js";
import Test from "../impl/utility/Test.js";
import NoFall from "../impl/world/NoFall.js";
import Timer from "../impl/world/Timer.js";
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
		new Timer(),
		new Criticals(),
		new TargetStrafe(),
		new RejoinOnMute(),
		new WTap(),
		new Blink(),
		new FakeLag(),
		this.hudManager,
		new AutoSword(),
		new Spider(),
		new ChestStealer(),
		new Test(),
		new TickBase(),
		new ChestAura()
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
