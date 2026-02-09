import getResourceURL from "@/utils/cachedResourceURL";

export enum Category {
	COMBAT,
	BLATANT,
	RENDER,
	WORLD,
	MINIGAMES,
	INVENTORY,
	UTILITY,
}
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
		name: "Combat",
	},
	[Category.BLATANT]: {
		icon: "blatant",
		name: "Blatant",
	},
	[Category.RENDER]: {
		icon: "render",
		name: "Render",
	},
	[Category.WORLD]: {
		icon: "world",
		name: "World",
	},
	[Category.MINIGAMES]: {
		icon: "minigames",
		name: "Minigames",
	},
	[Category.INVENTORY]: {
		icon: "inventory",
		name: "Inventory",
	},
	[Category.UTILITY]: {
		icon: "utility",
		name: "Utility",
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

export const categoryInfoSet: Record<Category, CategoryInfo> =
	Object.fromEntries(
		Object.entries(categoryDataSet).map(([k, v]) => {
			const c = Category[k];
			return [c, new CategoryInfo(v)];
		}),
	);
