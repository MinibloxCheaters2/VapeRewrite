// global CSS
import globalCss from "../style.css";

// Inject global CSS
GM_addStyle(globalCss);

import "./wait"; // putting the file's contents in this file would make Rollup position it after these imports.
import "./shadowWrapper";
import { initHudSystem } from "@/features/hud";
import { initHudGUI } from "./HudGUI";
import { initMainGUI } from "./MainGUI";
import { initNewClickGUI } from "./newClickGUI";
import { initNotifications } from "./notifications";
import { initProfilesPanel } from "./ProfilesPanel";
import { initSettingsPanel } from "./SettingsPanel";

// Initialize HUD system
initHudSystem();

// Initialize GUIs
initMainGUI();
initNewClickGUI();
initHudGUI();
initNotifications();
initSettingsPanel();
initProfilesPanel();
