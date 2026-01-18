import Bus from "./Bus";
import { storeName } from "./Client";
import type ClientEvents from "./event/api/Events";
import exposed, { type ExposedFromGame } from "./hooks/exposed";

export interface Store {
	/** Objects exposed from this client to the replacements */
	exposed: typeof exposed;
	/** Objects exposed from the replacements to this client */
	fgExposed: ExposedFromGame;
	emitEvent<E extends keyof ClientEvents>(
		event: E,
		...payload: ClientEvents[E] extends void ? [] : [ClientEvents[E]]
	): void;
	/** Saves this config to a config named {@link name} */
	saveConfig(name: string): Promise<void>;
	/** Loads a config named {@link switched}, or the current config's name if not specified. */
	loadConfig(switched?: string): Promise<void>;
	/** exports the currently loaded config to the clipboard */
	exportConfig(): void;
	/** imports a config from the clipboard and overwrites the current config data with it */
	importConfig(): Promise<void>;
	listConfigs(): string[];
}

export class ModuleConfig {
	// TODO: module settings
	constructor(public toggled: boolean /*, settings: Setting[]*/) {}
}

export class Config {
	public constructor(
		/** a map of module name -> module config */
		public modules: Record<string, ModuleConfig>,
	) {}

	public serialize(): string {
		return JSON.stringify(this.modules);
	}

	public static deserialize(_name: string, json: string): Config {
		const data: Record</* module name*/ string, ModuleConfig> =
			JSON.parse(json);
		return new Config(data);
	}
}

export class NamedConfig extends Config {
	public constructor(
		/** the name of the config */
		public name: string,
		/** a map of module name -> module config */
		public modules: Record<string, ModuleConfig>,
	) {
		super(modules);
	}

	public static deserialize(name: string, json: string): NamedConfig {
		const data: Record</* module name*/ string, ModuleConfig> =
			JSON.parse(json);
		return new NamedConfig(name, data);
	}
}

function configKey(n: string): string {
	return `vapeConfig${n}`;
}

let loadedConfig: NamedConfig;
/** Saves this config to a config named {@link name} */
async function saveConfig(name: string): Promise<void> {
	GM_setValue(configKey(name), loadedConfig.serialize());
}
/** Loads a config named {@link name}, or the current config's name if not specified. */
async function loadConfig(name: string = loadedConfig.name): Promise<void> {
	const cfg = GM_getValue(configKey(name), loadedConfig.serialize());
	loadedConfig = NamedConfig.deserialize(name, cfg);
}
/** exports the currently loaded config to the clipboard */
function exportConfig(): void {
	navigator.clipboard.writeText(loadedConfig.serialize());
}
/** imports a config from the clipboard and overwrites the current config data with it */
async function importConfig(): Promise<void> {
	const cfg = await navigator.clipboard.readText();
	if (!cfg) return; // this should never be `undefined`..? but original vape does this, so...
	GM_setValue(configKey(loadedConfig.name), cfg); // set
	loadConfig(); // reload
}

function listConfigs(): string[] {
	// TODO
	return [];
}

function emitEvent<E extends keyof ClientEvents>(
	event: E,
	...payload: ClientEvents[E] extends void ? [] : [ClientEvents[E]]
) {
	Bus.emit(event, ...payload);
}

const StoreInterop = {
	/** DO NOT CALL THIS IF THE STORE IS ALREADY AN OBJECT. */
	initStore() {
		unsafeWindow[storeName] = {
			exposed,
			fgExposed: {} as ExposedFromGame,
			saveConfig,
			loadConfig,
			exportConfig,
			importConfig,
			listConfigs,
			emitEvent,
		} satisfies Store;
	},
	initIfRequired() {
		if (typeof unsafeWindow[storeName] !== "object") {
			StoreInterop.initStore();
		}
	},
	get store(): Store {
		if (typeof unsafeWindow[storeName] !== "object") {
			StoreInterop.initStore();
		}
		unsafeWindow[storeName] ??= {};
		return unsafeWindow[storeName];
	},
} as const;

export default StoreInterop;

StoreInterop.initIfRequired();
