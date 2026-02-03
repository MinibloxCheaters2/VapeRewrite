// global CSS
import globalCss from "../style.css";

// Inject global CSS
GM_addStyle(globalCss);

import "./wait"; // putting the file's contents in this file would make Rollup position it after these imports.
import { initMainGUI } from "./MainGUI";
import { initNewClickGUI } from "./newClickGUI";
import { initNotifications } from "./notifications";
import { initProfilesPanel } from "./ProfilesPanel";
import { initSettingsPanel } from "./SettingsPanel";
import { initTextGUI } from "./TextGUI";

console.log("Vape Rewrite GUI initializing...");

// Initialize GUIs
initMainGUI();
initNewClickGUI();
initTextGUI();
initNotifications();
initSettingsPanel();
initProfilesPanel();

console.log("Vape Rewrite GUI initialized. Press \\ or RightShift to toggle.");
