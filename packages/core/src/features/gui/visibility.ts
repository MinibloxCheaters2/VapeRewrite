import { createSignal } from "solid-js";

/**
 * Whether the main GUI is currently open.
 *
 * This lives in core rather than the UI package because game code (HUDs,
 * click handling) needs to read it regardless of which UI is installed.
 */
export const [guiVisible, setGuiVisible] = createSignal(false);

/** Toggle the main GUI. */
export function toggleGUI() {
	setGuiVisible(!guiVisible());
}
