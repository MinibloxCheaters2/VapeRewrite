import Bus from "./Bus";
import type ClientEvents from "./event/api/Events";
import exposed from "./hooks/exposed";
import { storeName } from "./utils/names";

export interface Store {
	/** Objects exposed from this client to the replacements */
	exposed: typeof exposed;
	emitEvent<E extends keyof ClientEvents>(
		event: E,
		...payload: ClientEvents[E] extends void ? [] : [ClientEvents[E]]
	): void;
}

function emitEvent<E extends keyof ClientEvents>(
	event: E,
	...payload: ClientEvents[E] extends void ? [] : [ClientEvents[E]]
) {
	Bus.emit(event, ...payload);
}

const StoreInterop = {
	/** DO NOT CALL THIS IF THE STORE IS ALREADY AN OBJECT. */
	initStore() {
		unsafeWindow[storeName] = {
			exposed,
			emitEvent,
		} satisfies Store;
	},
	initIfRequired() {
		if (typeof unsafeWindow[storeName] !== "object") {
			StoreInterop.initStore();
		}
	},
	get store(): Store {
		if (typeof unsafeWindow[storeName] !== "object") {
			StoreInterop.initStore();
		}
		unsafeWindow[storeName] ??= {};
		return unsafeWindow[storeName];
	},
} as const;

export default StoreInterop;

StoreInterop.initIfRequired();
