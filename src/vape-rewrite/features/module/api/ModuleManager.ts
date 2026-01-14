import Mod, { Category } from "./Module.js";

/** some basic predicates for finding modules */
export const P = {
  /** filters to find a specific module by the same name (`===` operator) */
  byName: (name: string) => (module: Mod) => module.name === name,
  /** filters to find a specific module in the same state (mod.enabled === enabled) */
  byEnabled: (enabled: boolean) => (module: Mod) => module.enabled === enabled,
  /** filters to find a specific module by its category */
  byCategory: (category: Category) => (module: Mod) =>
    module.category === category,
};

export default class ModuleManager {
  // only important ish modules (ones that will get referenced in other modules)
  // should be as a variable instead of in the array

  constructor() {
    throw new Error("everything in module manager is static lol");
  }

  public static readonly modules: Mod[] = [
    // TODO: modules
  ] as const;

  public static findModule(
    predicate: (module: Mod) => boolean,
  ): Mod | undefined {
    return this.modules.find(predicate);
  }

  public static findModules(predicate: (module: Mod) => boolean): Mod[] {
    return this.modules.filter(predicate);
  }
}
