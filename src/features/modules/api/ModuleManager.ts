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
import AutoClicker from "../impl/combat/AutoClicker.js";
import Criticals from "../impl/combat/Criticals.js";
import Velocity from "../impl/combat/Velocity.js";
import WTap from "../impl/combat/WTap.js";
import AutoArmor from "../impl/inventory/AutoArmor.js";
import Breaker from "../impl/minigames/Breaker.js";
import ChestAura from "../impl/minigames/ChestAura.js";
import ChestStealer from "../impl/minigames/ChestStealer.js";
import HudManagerModule from "../impl/render/HudManager.js";
import AntiBan from "../impl/utility/AntiBan.js";
import AutoRespawn from "../impl/utility/AutoRespawn.js";
import AutoSword from "../impl/utility/AutoSword.js";
import FilterBypass from "../impl/utility/FilterBypass.js";
import PingSpoof from "../impl/utility/PingSpoof.js";
import RejoinOnMute from "../impl/utility/RejoinOnMute.js";
import ServerCrasher from "../impl/utility/ServerCrasher.js";
import Sprint from "../impl/utility/Sprint.js";
import Test from "../impl/utility/Test.js";
import NoFall from "../impl/world/NoFall.js";
import Timer from "../impl/world/Timer.js";
import type Category from "./Category.js";
import type Mod from "./Module.js";

/** some basic predicates for finding modules */
export const P = {
	/**
	 * Filters to find a specific module by the same name (`===` operator).
	 * If you need to reference another module, make a `static readonly` variable for it in `ModuleManager`.
	 * It is more performant to get a field from the ModuleManager
	 * than to iterate over all modules and find one with the same name (O(1) for getting a field vs O(n) for iteration).
	 */
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
	static readonly antiBan = new AntiBan();
	static readonly noSlow = new NoSlow();
	static readonly phase = new Phase();
	static readonly scaffold = new Scaffold();
	static readonly hudManager = new HudManagerModule();

	private constructor() {
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
		new ChestAura(),
		new PingSpoof(),
		new Sprint(),
		new AutoClicker(),
		new Breaker(),
		new AutoArmor(),
	] as const;

	/** Each module's name */
	static readonly moduleNames: string[] = this.modules.map((m) => m.name);

	/**
	 * Finds a module that matches the given predicate.
	 * @param predicate The predicate to match modules against.
	 * @returns The module that matches the predicate, or undefined if no module matches.
	 */
	static findModule(predicate: (module: Mod) => boolean): Mod | undefined {
		return ModuleManager.modules.find(predicate);
	}

	/**
	 * Finds all modules that match the given predicate.
	 * @param predicate The predicate to match modules against.
	 * @returns An array of modules that match the predicate.
	 */
	static findModules(predicate: (module: Mod) => boolean): Mod[] {
		return ModuleManager.modules.filter(predicate);
	}
}
