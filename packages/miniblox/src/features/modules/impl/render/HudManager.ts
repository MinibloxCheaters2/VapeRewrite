import { Category } from "@vape-rewrite/core";
import { Mod } from "@vape-rewrite/core";
import { guiVisible, setGuiVisible } from "@vape-rewrite/core";

export default class HudManagerModule extends Mod {
	public name = "HudManager";
	public category = Category.RENDER;
	public static readonly INSTANCE = new HudManagerModule();

	private wasGuiVisible = false;

	protected onEnable(): void {
		// Save current GUI state
		this.wasGuiVisible = guiVisible();
		// Close ClickGUI when HudManager is opened
		setGuiVisible(false);
	}

	protected onDisable(): void {
		// Restore previous GUI state
		if (this.wasGuiVisible) {
			setGuiVisible(true);
		}
	}
}
