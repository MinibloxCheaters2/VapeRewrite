import ModuleManager, { P } from "../modules/api/ModuleManager";
import type { BaseSetting } from "./Settings";

export interface SerializedSetting<V> {
	name: string;
	type: string;
	value: V;
}

function serializeBaseSetting<V>(set: BaseSetting<V>): SerializedSetting<V> {
	return {
		name: set.name,
		type: set.type,
		value: set.value(),
	};
}

export class ModuleConfig {
	// TODO: module settings
	constructor(
		public enabled: boolean,
		public settings: SerializedSetting<unknown>[],
	) {}
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

const CONFIG_KEY_PREFIX = "vapeConfig";

export function configKey(n: string): string {
	return `${CONFIG_KEY_PREFIX}${n}`;
}

export function isConfigKey(n: string): boolean {
	return n.startsWith(CONFIG_KEY_PREFIX);
}

let loadedConfig: NamedConfig = new NamedConfig("default", {});

/** Saves this config to a config named {@link name} */
export async function saveConfig(name: string): Promise<void> {
	GM_setValue(configKey(name), loadedConfig.serialize());
}

/** Loads a config named {@link name}, or the current config's name if not specified. */
export async function loadConfig(
	name: string = loadedConfig.name,
): Promise<void> {
	const cfg = GM_getValue(configKey(name), loadedConfig.serialize());
	loadedConfig = NamedConfig.deserialize(name, cfg);

	for (const [name, config] of Object.entries(loadedConfig.modules)) {
		const mod = ModuleManager.findModule(P.byName(name));
		mod.enabled = config.enabled;
		// catgpt optimization gg
		const lookup = new Map(config.settings.map((s) => [s.name, s.value]));

		for (const setting of mod.settings) {
			if (lookup.has(setting.name)) {
				// why is it doing ts idk cat
				(setting.setValue as (value: unknown) => void)(
					lookup.get(setting.name),
				);
			}
		}
	}
}

/** exports the currently loaded config to the clipboard */
export function exportConfig(): void {
	navigator.clipboard.writeText(loadedConfig.serialize());
}

/** imports a config from the clipboard and overwrites the current config data with it */
export async function importConfig(): Promise<void> {
	const cfg = await navigator.clipboard.readText();
	if (!cfg) return; // this should never be `undefined`..? but original vape does this, so...
	GM_setValue(configKey(loadedConfig.name), cfg); // set
	loadConfig(); // reload
}

export function listConfigs(): string[] {
	// TODO
	return GM_listValues()
		.filter(isConfigKey)
		.map((a) => a.slice(CONFIG_KEY_PREFIX.length));
}
