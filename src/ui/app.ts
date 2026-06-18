import "./shadowWrapper";
import { initHudSystem } from "@/features/hud";
// global CSS
import globalCss from "../style.css";
import { initHudGUI } from "./HudGUI";
import { initMainGUI } from "./MainGUI";
import { initMusicPlayer } from "./MusicPlayer";
import { initNewClickGUI } from "./newClickGUI";
import { initNotifications } from "./notifications";
import { initProfilesPanel } from "./ProfilesPanel";
import { initSettingsPanel } from "./SettingsPanel";
import shadowWrapper from "./shadowWrapper";
import waitForLoad from "./wait";

let initialized = false;

waitForLoad().then(() => {
	if (initialized) return;
	initialized = true;

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
	const css = document.createElement("style");
	css.innerText = globalCss;
	shadowWrapper.root.appendChild(css);
});
