import { setUiApi } from "@vape/ui-api";

import {
	rainbowMode,
	rainbowSpeed,
	rainbowUpdateRate,
	teamsByServerEnabled,
	toggleAlertEnabled,
} from "./globalSettings";
import { guiVisible, setGuiVisible } from "./guiState";
import { showNotification } from "./notifications";

/**
 * Exposes this UI to the rest of the cheat through the `@vape/ui-api` boundary.
 * Importing this module is what "installs" the UI; core and game code only ever
 * see the `UiApi` interface.
 */
setUiApi({
	showNotification,
	toggleAlertEnabled,
	guiVisible,
	setGuiVisible,
	rainbowMode,
	rainbowSpeed,
	rainbowUpdateRate,
	teamsByServerEnabled,
});
