import { createSignal } from "solid-js";
import { addBind } from "@/features/binds/handler";
import logger from "@/utils/loggers";

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

export const [categoryWindows, setCategoryWindows] =
	createSignal<Record<string, boolean>>(initialCategories);

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

// Toggle GUI visibility
export function toggleGUI() {
	const newState = !guiVisible();
	setGuiVisible(newState);
}

// Setup keybind using existing bind system
if (typeof window !== "undefined") {
	// Wait for DOM to be ready
	setTimeout(() => {
		try {
			// Register \ key (Backslash)
			addBind("\\", "gui-toggle", (e) => {
				e.preventDefault();
				e.stopPropagation();
				toggleGUI();
			});

			// Also register RightShift as alternative
			addBind("Shift", "gui-toggle-shift", (e) => {
				if (e.location === 2) {
					e.preventDefault();
					e.stopPropagation();
					toggleGUI();
				}
			});
		} catch (error) {
			logger.error("Failed to register GUI keybinds:", error);
		}
	}, 100);
}
