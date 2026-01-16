import logger from "../../../utils/loggers";

export enum Category {
  COMBAT,
  RENDER,
  BLATANT,
  WORLD,
  MINIGAMES,
  INVENTORY,
  UTILITY
};
export default Category;

interface CategoryData {
  /**
   * resource name of the category's icon. make sure to update `meta.js` to add `@resource {icon name} https://link.to/icon.png` if it's not already there!
  */
  icon: string;

  /** title case version of the category's name */
  name: string;
}

const categoryDataSet: Record<Category, CategoryData> = {
  [Category.COMBAT]: {
    icon: "combat",
    name: "Combat"
  },
  [Category.RENDER]: {
    icon: "render",
    name: "Render"
  },
  [Category.BLATANT]: {
    icon: "blatant",
    name: "Blatant"
  },
  [Category.WORLD]: {
    icon: "world",
    name: "World"
  },
  [Category.MINIGAMES]: {
    icon: "minigames",
    name: "Minigames"
  },
  [Category.INVENTORY]: {
    icon: "inventory",
    name: "Inventory"
  },
  [Category.UTILITY]: {
    icon: "utility",
    name: "Utility"
  }
} as const;

export class CategoryInfo {
  public constructor(public data: CategoryData) { }
  public static for(c: Category): CategoryInfo {
    return categoryInfoSet[c] ??= new CategoryInfo(categoryDataSet[c]);
  }
  get iconURL(): string {
    const rURL = GM_getResourceURL(this.data.icon);
    logger.debug(`Icon ID for ${this.data.name} = ${this.data.icon} -> ${rURL}`);
    return rURL;
  }
}

export const categoryInfoSet: Record<Category, CategoryInfo> = Object.fromEntries(Object.entries(categoryDataSet).map(([k, v]) => {
  const c = Category[k];
  return [c, new CategoryInfo(v)];
}));
