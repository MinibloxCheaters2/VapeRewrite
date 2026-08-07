import type Mod from "../modules/api/Module";
import Configurable from "./Configurable";

export default class SubModule<P extends Mod> extends Configurable {
	public readonly name: string;

	constructor(public parent: P, name?: string) {
		super();
		this.modNameForConfig = parent.name;
		this.name = name ?? this.constructor.name;
	}

	onEnable(): void {}
	onDisable(): void {}
	getTag(): string | undefined { return undefined; }
}
