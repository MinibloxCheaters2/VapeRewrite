import { setUiApi } from "@vape/ui-api";

import { showNotification } from "./notifications";

/**
 * Exposes this UI to the rest of the cheat through the `@vape/ui-api` boundary.
 * Importing this module is what "installs" the UI; core and game code only ever
 * see the `UiApi` interface.
 */
setUiApi({
	showNotification,
});
