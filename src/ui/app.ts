import "./shadowWrapper";
import "@/features/modules/legit";
import { initConfig } from "@/features/config/configs";
import { loadBinds } from "@/features/binds/storage";
import { initHudSystem } from "@/features/hud";
// global CSS
import globalCss from "../style.css";
import { initFriendsPanel } from "./FriendsPanel";
import { initHudGUI } from "./HudGUI";
import { initMainGUI } from "./MainGUI";
import { initMusicPlayer } from "./MusicPlayer";
import { initNewClickGUI } from "./newClickGUI";
import { initNotifications } from "./notifications";
import { initProfilesPanel } from "./ProfilesPanel";
import { initSettingsPanel } from "./SettingsPanel";
import shadowWrapper from "./shadowWrapper";
import { initTargetsPanel } from "./TargetsPanel";

// Initialize HUD system
initHudSystem();

// Apply persisted config + binds now that modules are registered
loadBinds();
initConfig();

// Initialize GUIs
initMainGUI();
initNewClickGUI();
initHudGUI();
initNotifications();
initSettingsPanel();
initProfilesPanel();
initFriendsPanel();
initTargetsPanel();
initMusicPlayer();
const css = document.createElement("style");
css.innerText = globalCss;
shadowWrapper.root.appendChild(css);
