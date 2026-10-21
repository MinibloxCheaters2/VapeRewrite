import "./api";
import { loadBinds } from "@vape/core";
import { initConfig } from "@vape/core";
import { shadowWrapper } from "@vape/core";

import { initFriendsPanel } from "./FriendsPanel";
import { initHudGUI } from "./HudGUI";
import { initMainGUI } from "./MainGUI";
import { initNotifications } from "./notifications";
import { initProfilesPanel } from "./ProfilesPanel";
import { initSettingsPanel } from "./SettingsPanel";
// global CSS
import globalCss from "./style.css";
import { initTargetsPanel } from "./TargetsPanel";

export function initApp() {
	// Apply persisted config + binds now that modules are registered
	loadBinds();
	initConfig();

	// Initialize GUIs
	initMainGUI();
	initHudGUI();
	initNotifications();
	initSettingsPanel();
	initProfilesPanel();
	initFriendsPanel();
	initTargetsPanel();
	// initMusicPlayer();
	const css = document.createElement("style");
	css.innerText = globalCss;
	shadowWrapper.root.appendChild(css);
}
