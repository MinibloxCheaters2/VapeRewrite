import { storeName } from "../Client";
import Bus from "./Bus";
import ClientEvents from "./event/api/Events";
import exposed from "./hooks/exposed";

export interface Store {
  exposed: typeof exposed;
  emitEvent<E extends keyof ClientEvents>(event: E, ...payload: ClientEvents[E] extends void ? [] : [ClientEvents[E]]): void;
  /** Saves this config to a config named {@link name} */
  saveConfig(name: string): Promise<void>;
  /** Loads a config named {@link switched}, or the current config's name if not specified. */
  loadConfig(switched?: string): Promise<void>;
  /** exports the currently loaded config to the clipboard */
  exportConfig(): void;
  /** imports a config from the clipboard and overwrites the current config data with it */
  importConfig(): Promise<void>;
};

export class ModuleConfig {
  // TODO: module settings
  constructor(public toggled: boolean/*, settings: Setting[]*/) {}
}

export class Config {
  public constructor(
    /** a map of module name -> module config */
    public modules: Record<string, ModuleConfig>
  ) {}

  public serialize(): string {
    return JSON.stringify(this.modules);
  }

  public static deserialize(name: string, json: string): Config {
    const data: Record</* module name*/string, ModuleConfig> = JSON.parse(json);
    return new Config(data);
  }
}

export class NamedConfig extends Config {
  public constructor(
    /** the name of the config */
    public name: string,
    /** a map of module name -> module config */
    public modules: Record<string, ModuleConfig>
  ) {
    super(modules);
  }

  public static deserialize(name: string, json: string): NamedConfig {
    const data: Record</* module name*/string, ModuleConfig> = JSON.parse(json);
    return new NamedConfig(name, data);
  }
}

function configKey(n: string): string { return `vapeConfig${n}` }

class ConfigHandler {
  public static loadedConfig: NamedConfig;
  /** Saves this config to a config named {@link name} */
  public static async saveConfig(name: string): Promise<void> {
    GM_setValue(configKey(name), this.loadedConfig.serialize());
  }
  /** Loads a config named {@link name}, or the current config's name if not specified. */
  public static async loadConfig(name: string = this.loadedConfig.name): Promise<void> {
    const cfg = GM_getValue(configKey(name), this.loadedConfig.serialize());
    this.loadedConfig = NamedConfig.deserialize(name, cfg);
  }
  /** exports the currently loaded config to the clipboard */
  public static exportConfig(): void {
    navigator.clipboard.writeText(this.loadedConfig.serialize());
  }
  /** imports a config from the clipboard and overwrites the current config data with it */
  public static async importConfig(): Promise<void> {
    const cfg = await navigator.clipboard.readText();
    if (!cfg) return; // this should never be `undefined`..? but original vape does this, so...
    GM_setValue(configKey(this.loadedConfig.name), cfg); // set
    ConfigHandler.loadConfig(); // reload
  }
}

export class EventBusInterop {
  public static emitEvent<E extends keyof ClientEvents>(event: E, ...payload: ClientEvents[E] extends void ? [] : [ClientEvents[E]]) {
    Bus.emit(event, ...payload);
  }
}

export default class StoreInterop {
  /** DO NOT CALL THIS IF THE STORE IS ALREADY AN OBJECT. */
  private static initStore() {
    unsafeWindow[storeName] = {
      exposed,
      saveConfig: ConfigHandler.saveConfig,
      loadConfig: ConfigHandler.loadConfig,
      exportConfig: ConfigHandler.exportConfig,
      importConfig: ConfigHandler.importConfig,
      emitEvent: EventBusInterop.emitEvent
    } satisfies Store;
  }
  public static initIfRequired() {
    if (typeof unsafeWindow[storeName] !== "object") {
      this.initStore();
    }
  }
  public static get store(): Store {
    if (typeof unsafeWindow[storeName] !== "object") {
      this.initStore();
    }
    return unsafeWindow[storeName] ??= {};
  }
}

StoreInterop.initIfRequired();

