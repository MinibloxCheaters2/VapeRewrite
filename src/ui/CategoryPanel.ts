import { getPanel } from "@wq2/ui";
import { render } from "solid-js/web";
import { dragHandleAttrName } from "@/utils/names";
import { categoryInfoSet } from "../features/modules/api/Category";
import CategoryUI from "./components/CategoryComponent";

let catIdx = 0;

const priority = {
	combat: 2,
	blatant: 3,
	render: 4,
	utility: 5,
	world: 6,
	inventory: 7,
	minigames: 8,
} as const;

for (const [cat, info] of Object.entries(categoryInfoSet).sort(([an], [bn]) => {
	return (priority[an] ?? 99) - (priority[bn] ?? 99);
})) {
	const categoryPanel = getPanel({
		theme: "dark",
	});

	const left = 4 + (catIdx++ % 8) * 138;

	Object.assign(categoryPanel.wrapper.style, {
		top: `60px`,
		left: `${left}px`,
	});
	categoryPanel.setMovable(true, {
		canDrag(e) {
			const target = e.target as HTMLElement;
			return !!target.closest(`[${dragHandleAttrName}]`);
		},
	});
	categoryPanel.show();
	render(() => CategoryUI(cat, info), categoryPanel.body);
}
