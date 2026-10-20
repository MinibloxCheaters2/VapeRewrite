/**
 * The boundary between the cheat's logic and its user interface.
 *
 * Core code and game packages never import the UI implementation directly:
 * they talk to the functions exported here, which delegate to whichever
 * `UiApi` implementation has been registered. Swapping the UI therefore only
 * means registering a different implementation (see `@vape/ui` for the default).
 *
 * This package must stay dependency-free so any UI implementation can register
 * itself without pulling the current one in.
 */

export type Accessor<T> = () => T;

export type NotificationType = "info" | "warning" | "alert";

export interface UiApi {
	/** Show a toast notification over the game. */
	showNotification(
		title: string,
		message: string,
		type?: NotificationType,
		duration?: number,
	): void;

	/** Whether toggling a module should pop a notification. */
	toggleAlertEnabled: Accessor<boolean>;

	/** Whether the main GUI is currently open. */
	guiVisible: Accessor<boolean>;
	setGuiVisible(visible: boolean): void;

	/** Rainbow/theme options used by HUD elements. */
	rainbowMode: Accessor<string>;
	rainbowSpeed: Accessor<number>;
	rainbowUpdateRate: Accessor<number>;

	/** Whether teams are grouped by server. */
	teamsByServerEnabled: Accessor<boolean>;
}

let activeUi: UiApi | undefined;

/**
 * Registers the UI implementation that all UI calls are forwarded to.
 * Called once by a UI package as a side effect of being imported.
 */
export function setUiApi(ui: UiApi): void {
	activeUi = ui;
}

/** The registered UI implementation, or `undefined` if none is installed. */
export function getUiApi(): UiApi | undefined {
	return activeUi;
}

// ── Defaults ──────────────────────────────────────────────────────────
// These are used until a UI is registered so that core/game code never has to
// null-check the UI. They mirror the shipped UI's defaults.

const DEFAULT_RAINBOW_MODE = "Normal";
const DEFAULT_RAINBOW_SPEED = 1;
const DEFAULT_RAINBOW_UPDATE_RATE = 60;

export function showNotification(...args: Parameters<UiApi["showNotification"]>): void {
	activeUi?.showNotification(...args);
}

export const toggleAlertEnabled: Accessor<boolean> = () => activeUi?.toggleAlertEnabled() ?? true;

export const guiVisible: Accessor<boolean> = () => activeUi?.guiVisible() ?? false;

export function setGuiVisible(visible: boolean): void {
	activeUi?.setGuiVisible(visible);
}

export const rainbowMode: Accessor<string> = () =>
	activeUi?.rainbowMode() ?? DEFAULT_RAINBOW_MODE;

export const rainbowSpeed: Accessor<number> = () =>
	activeUi?.rainbowSpeed() ?? DEFAULT_RAINBOW_SPEED;

export const rainbowUpdateRate: Accessor<number> = () =>
	activeUi?.rainbowUpdateRate() ?? DEFAULT_RAINBOW_UPDATE_RATE;

export const teamsByServerEnabled: Accessor<boolean> = () =>
	activeUi?.teamsByServerEnabled() ?? true;
