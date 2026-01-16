import { storeName } from "../Client";
import Bus from "./Bus";
import ClientEvents from "./event/api/Events";
export interface Store {
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

class Config {
  public name: string;

  serialize(): string {
    return JSON.stringify({
      // TODO: serialization...
    });
  }
  static deserialize(json: string): Config {
    // TODO: deserialization
    const data = JSON.parse(json);
    // TODO: this intentionally will never execute,
    //       it's just a template for later actually implementing deserializing configs.
    if (Math.random() > 1) {
      console.log(data);
    }
    return new Config();
  }
}

function configKey(n: string): string { return `vapeConfig${n}` }

class ConfigHandler {
  public static loadedConfig: Config;
  /** Saves this config to a config named {@link name} */
  public static async saveConfig(name: string): Promise<void> {
    GM_setValue(configKey(name), this.loadedConfig.serialize());
  }
  /** Loads a config named {@link name}, or the current config's name if not specified. */
  public static async loadConfig(name: string = this.loadedConfig.name): Promise<void> {
    const cfg = GM_getValue(configKey(name),  this.loadedConfig.serialize());
    this.loadedConfig = Config.deserialize(cfg);
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

