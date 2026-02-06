import { guiVisible, setGuiVisible } from "@/ui/guiState";
import Category from "../../api/Category";
import Mod from "../../api/Module";

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
