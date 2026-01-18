import { render } from "solid-js/web";
import { getPanel } from "@violentmonkey/ui";
import { categoryInfoSet } from "../features/module/api/Category";
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

	categoryPanel.wrapper.addEventListener("mousedown", () => {
		categoryPanel.wrapper.style.cursor = "grabbing";
	});
	categoryPanel.wrapper.addEventListener("mouseup", () => {
		categoryPanel.wrapper.style.cursor = "auto";
	});
	categoryPanel.setMovable(true);
	categoryPanel.show();
	render(() => CategoryUI(cat, info), categoryPanel.body);
}
