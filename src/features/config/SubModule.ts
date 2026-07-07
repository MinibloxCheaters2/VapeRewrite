import type Mod from "../modules/api/Module";
import Configurable from "./Configurable";
import type { AnySetting } from "./Settings";

export default class SubModule extends Configurable {
	constructor(mod: Mod, target: AnySetting[]) {
		super();
		this.modNameForConfig = mod.name;
		this.settings = target;
	}
}
