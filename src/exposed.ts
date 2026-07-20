/**
 * Makes an object for storing stuff if the debug flag is enabled
 * @module
 */

import { EXPOSE_SYMBOLS, LOG_EXPOSE_NAME } from "./debugControls";
import { MAIN_LOGGER as logger } from "./utils";
import { exposedName } from "./utils/mapping/names";

function getStore(): { [k: string]: unknown } {
	if (!("_store" in getStore))
		(getStore as typeof getStore & { _store: object })._store = {};
	return (getStore as typeof getStore & { _store: object })._store;
}

function init() {
	if (!EXPOSE_SYMBOLS) return;
	//@ts-expect-error: I need to create a property for ts
	unsafeWindow[exposedName] = getStore();
	if (LOG_EXPOSE_NAME) logger.info("Symbol expose store name:", exposedName);
}
export function expose(name: string, value: () => unknown) {
	if (!EXPOSE_SYMBOLS) return;
	getStore()[name] = value();
}

init();
