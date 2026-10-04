/**
 * Makes an object for storing stuff if the debug flag is enabled
 * @module
 */

import { EXPOSE_SYMBOLS, LOG_EXPOSE_NAME } from "./debugControls";
import { MAIN_LOGGER as logger } from "./utils/logging/loggers";
import { exposedName } from "./utils/mapping/names";

let store: object = {};

function init() {
	if (!EXPOSE_SYMBOLS) return;
	unsafeWindow[exposedName] = store;
	if (LOG_EXPOSE_NAME) logger.info("Symbol expose store name:", exposedName);
}
export function expose(name: string, value: () => unknown) {
	if (!EXPOSE_SYMBOLS) return;
	store[name] = value();
}

init();
