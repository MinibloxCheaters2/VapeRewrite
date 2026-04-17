import { MAIN_LOGGER as logger } from "@/utils";
import type Mod from "../modules/api/Module";
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
	constructor(
		public enabled: boolean,
		public settings: SerializedSetting<unknown>[],
	) {}
	static from(mod: Mod): ModuleConfig {
		const settings = mod.settings.map((x) =>
			serializeBaseSetting<unknown>(x),
		);
		return new ModuleConfig(mod.enabled, settings);
	}
}

function serializeModules(): Record<string, ModuleConfig> {
	return Object.fromEntries(
		ModuleManager.modules.map((x) => [x.name, ModuleConfig.from(x)]),
	);
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

export let loadedConfig = new NamedConfig("default", {});

/** Saves this config to a config named {@link name} */
export function saveConfig(name: string) {
	GM_setValue(configKey(name), loadedConfig.serialize());
}

/** Loads a config named {@link name}, or the current config's name if not specified. */
export function loadConfig(name: string = loadedConfig.name) {
	const cfg = GM_getValue(configKey(name), loadedConfig.serialize());
	loadedConfig = NamedConfig.deserialize(name, cfg);

	for (const [name, config] of Object.entries(loadedConfig.modules)) {
		const mod = ModuleManager.findModule(P.byName(name));
		if (mod === undefined) {
			logger.warn("Module not found while loading config:", mod);
			continue;
		}
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
	return GM_listValues()
		.filter(isConfigKey)
		.map((a) => a.slice(CONFIG_KEY_PREFIX.length));
}

/** Updates the loadedConfig to reflect the current state of modules and settings */
export function updateLoadedConfig(moduleName?: string, settingName?: string) {
	if (!moduleName) {
		// Full update
		loadedConfig.modules = serializeModules();
		return;
	}

	const mod = ModuleManager.findModule(P.byName(moduleName));
	if (!mod) return;

	if (!settingName) {
		// Update entire module
		loadedConfig.modules[moduleName] = ModuleConfig.from(mod);
		return;
	}

	// Update specific setting
	const setting = mod.settings.find((s) => s.name === settingName);
	if (!setting) return;

	const serialized = serializeBaseSetting<unknown>(setting);
	const moduleConfig = loadedConfig.modules[moduleName];
	if (moduleConfig) {
		const index = moduleConfig.settings.findIndex(
			(s) => s.name === settingName,
		);
		if (index !== -1) {
			moduleConfig.settings[index] = serialized;
		}
	}
}
