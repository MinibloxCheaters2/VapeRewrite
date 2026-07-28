import type Mod from "../modules/api/Module";
import Configurable from "./Configurable";
import type { AnySetting } from "./Settings";

export default class SubModule<P extends Mod> extends Configurable {
	constructor(public parent: P, target: AnySetting[]) {
		super();
		this.modNameForConfig = parent.name;
		this.settings = target;
	}
}
