import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { guiVisible, setGuiVisible } from "@vape/core/ui/guiState";

export default class HudManagerModule extends Mod {
	public name = "HudManager";
	public category = Category.RENDER;

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
