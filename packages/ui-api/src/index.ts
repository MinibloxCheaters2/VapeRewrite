export type NotificationType = "info" | "warning" | "alert";

export interface UiApi {
	/** Show a toast notification over the game. */
	showNotification(
		title: string,
		message: string,
		type?: NotificationType,
		duration?: number,
	): void;
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

/** Shows a notification, or does nothing if no UI is installed. */
export function showNotification(...args: Parameters<UiApi["showNotification"]>): void {
	activeUi?.showNotification(...args);
}
