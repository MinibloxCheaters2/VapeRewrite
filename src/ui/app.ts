// global CSS
import globalCss from "../style.css";

// Inject global CSS
GM_addStyle(globalCss);

import "./shadowWrapper";
import { initHudSystem } from "@/features/hud";
import { initHudGUI } from "./HudGUI";
import { initMainGUI } from "./MainGUI";
import { initMusicPlayer } from "./MusicPlayer";
import { initNewClickGUI } from "./newClickGUI";
import { initNotifications } from "./notifications";
import { initProfilesPanel } from "./ProfilesPanel";
import { initSettingsPanel } from "./SettingsPanel";
import waitForLoad from "./wait";

waitForLoad().then(() => {
	// Initialize HUD system
	initHudSystem();

	// Initialize GUIs
	initMainGUI();
	initNewClickGUI();
	initHudGUI();
	initNotifications();
	initSettingsPanel();
	initProfilesPanel();
	initMusicPlayer();
});
