import getResourceURL from "@/utils/helpers/cachedResourceURL";

export enum Category {
	COMBAT,
	BLATANT,
	RENDER,
	UTILITY,
	WORLD,
	INVENTORY,
	MINIGAMES,
}
export default Category;

export interface CategoryData {
	/**
	 * resource name of the category's icon. make sure to update `meta.js` to add `@resource {icon name} https://link.to/icon.png` if it's not already there!
	 */
	icon: string;

	/** title case version of the category's name */
	name: string;

	/** icon dimensions [width, height] */
	size: [number, number];
}

const categoryDataSet: Record<Category, CategoryData> = {
	[Category.COMBAT]: {
		icon: "combat",
		name: "Combat",
		size: [13, 14],
	},
	[Category.BLATANT]: {
		icon: "blatant",
		name: "Blatant",
		size: [14, 14],
	},
	[Category.RENDER]: {
		icon: "render",
		name: "Render",
		size: [15, 14],
	},
	[Category.WORLD]: {
		icon: "world",
		name: "World",
		size: [14, 14],
	},
	[Category.MINIGAMES]: {
		icon: "minigames",
		name: "Minigames",
		size: [19, 12],
	},
	[Category.INVENTORY]: {
		icon: "inventory",
		name: "Inventory",
		size: [15, 14],
	},
	[Category.UTILITY]: {
		icon: "utility",
		name: "Utility",
		size: [15, 14],
	},
} as const;

export class CategoryInfo {
	#cachedIconURL?: string;
	public constructor(public data: CategoryData) {}
	public static for(c: Category): CategoryInfo {
		const lol = categoryInfoSet[c] ?? new CategoryInfo(categoryDataSet[c]);
		categoryInfoSet[c] ??= lol;
		return lol;
	}
	get iconURL(): string {
		this.#cachedIconURL ??= getResourceURL(this.data.icon);
		return this.#cachedIconURL;
	}
}

export const categoryInfoSet: Record<Category, CategoryInfo> = Object.fromEntries(
	Object.entries(categoryDataSet).map(([k, v]) => {
		//@ts-expect-error: Numerical TypeScript enums have aliases for their names, it produces `Enum[Enum["KEY"] = 0] = "KEY";`
		const c = Category[k];
		return [c, new CategoryInfo(v)];
	}),
);
