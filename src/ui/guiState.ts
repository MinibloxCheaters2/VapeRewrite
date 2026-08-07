import { createEffect, createSignal } from "solid-js";
import { addBind } from "@/features/binds/handler";
import logger from "@/utils/logging/loggers";

function readStoredJSON<T>(key: string, fallback: T): T {
	try {
		const raw = GM_getValue<string>(key, "");
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

// Global GUI visibility state - default hidden (open with \ key)
export const [guiVisible, setGuiVisible] = createSignal(false);

// Category window visibility states - all hidden by default
const initialCategories: Record<string, boolean> = {
	combat: false,
	blatant: false,
	utility: false,
	world: false,
	render: false,
	inventory: false,
	minigames: false,
};

export const [categoryWindows, setCategoryWindows] = createSignal<Record<string, boolean>>({
	...initialCategories,
	...readStoredJSON<Partial<Record<string, boolean>>>("vapeGuiCategoryWindows", {}),
});

// Toggle category window
export function toggleCategoryWindow(category: string) {
	setCategoryWindows((prev) => ({
		...prev,
		[category]: !prev[category],
	}));
}

// Check if category window is visible
export function isCategoryWindowVisible(category: string): boolean {
	return categoryWindows()[category] || false;
}

// Per-category expanded state (right-click or header click to expand)
export const [categoryExpanded, setCategoryExpanded] = createSignal<Record<string, boolean>>(
	readStoredJSON<Record<string, boolean>>("vapeGuiCategoryExpanded", {}),
);

export function toggleCategoryExpanded(category: string) {
	setCategoryExpanded((prev) => ({
		...prev,
		[category]: !prev[category],
	}));
}

// Category window positions - cascading offsets so they don't overlap
const initialPositions: Record<string, { x: number; y: number }> = {
	combat: { x: 240, y: 46 },
	blatant: { x: 260, y: 76 },
	render: { x: 280, y: 106 },
	utility: { x: 300, y: 136 },
	world: { x: 320, y: 166 },
	inventory: { x: 340, y: 196 },
	minigames: { x: 360, y: 226 },
};

export const [categoryWindowPositions, setCategoryWindowPositions] = createSignal<
	Record<string, { x: number; y: number }>
>({
	...initialPositions,
	...readStoredJSON<Partial<Record<string, { x: number; y: number }>>>(
		"vapeGuiCategoryPositions",
		{},
	),
});

export function setCategoryWindowPosition(category: string, x: number, y: number) {
	setCategoryWindowPositions((prev) => ({
		...prev,
		[category]: { x, y },
	}));
}

// Toggle GUI visibility
export function toggleGUI() {
	const newState = !guiVisible();
	setGuiVisible(newState);
}

export const [legitWindowVisible, setLegitWindowVisible] = createSignal(
	readStoredJSON<boolean>("vapeGuiLegitWindowVisible", false),
);
export const [legitWindowPosition, setLegitWindowPosition] = createSignal(
	readStoredJSON<{ x: number; y: number }>("vapeGuiLegitWindowPosition", { x: 300, y: 100 }),
);
export function toggleLegitWindow() {
	setLegitWindowVisible((v) => !v);
}

export const [friendsPanelVisible, setFriendsPanelVisible] = createSignal(
	readStoredJSON<boolean>("vapeGuiFriendsPanelVisible", false),
);
export const [targetsPanelVisible, setTargetsPanelVisible] = createSignal(
	readStoredJSON<boolean>("vapeGuiTargetsPanelVisible", false),
);
export const [friendsPanelPosition, setFriendsPanelPosition] = createSignal(
	readStoredJSON<{ x: number; y: number }>("vapeGuiFriendsPanelPosition", { x: 240, y: 46 }),
);
export const [targetsPanelPosition, setTargetsPanelPosition] = createSignal(
	readStoredJSON<{ x: number; y: number }>("vapeGuiTargetsPanelPosition", { x: 260, y: 60 }),
);

// Persist ClickGUI state so it survives page reloads.
createEffect(() => {
	GM_setValue("vapeGuiCategoryWindows", JSON.stringify(categoryWindows()));
});
createEffect(() => {
	GM_setValue("vapeGuiCategoryPositions", JSON.stringify(categoryWindowPositions()));
});
createEffect(() => {
	GM_setValue("vapeGuiCategoryExpanded", JSON.stringify(categoryExpanded()));
});
createEffect(() => {
	GM_setValue("vapeGuiLegitWindowVisible", JSON.stringify(legitWindowVisible()));
});
createEffect(() => {
	GM_setValue("vapeGuiLegitWindowPosition", JSON.stringify(legitWindowPosition()));
});
createEffect(() => {
	GM_setValue("vapeGuiFriendsPanelVisible", JSON.stringify(friendsPanelVisible()));
});
createEffect(() => {
	GM_setValue("vapeGuiTargetsPanelVisible", JSON.stringify(targetsPanelVisible()));
});
createEffect(() => {
	GM_setValue("vapeGuiFriendsPanelPosition", JSON.stringify(friendsPanelPosition()));
});
createEffect(() => {
	GM_setValue("vapeGuiTargetsPanelPosition", JSON.stringify(targetsPanelPosition()));
});

try {
	// Register \ key (Backslash)
	addBind("Backslash", "gui-toggle", (e) => {
		e.preventDefault();
		e.stopPropagation();
		toggleGUI();
	});

	// Also register RightShift as alternative
	addBind("ShiftRight", "gui-toggle-shift", (e) => {
		e.preventDefault();
		e.stopPropagation();
		toggleGUI();
	});
} catch (error) {
	logger.error("Failed to register GUI keybinds:", error);
}
