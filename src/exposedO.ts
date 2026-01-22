/**
 * Moved out of the Store class to fix a circular dependency:
 * src/features/module/api/ModuleManager.ts
 *	-> src/features/module/impl/blatant/InfiniteFly.ts
 *	-> src/utils/key.ts
 *	-> src/interop.ts
 *	-> src/hooks/exposed.ts
 * -> src/features/module/api/ModuleManager.ts
 * @module
 */

import { fgExposedName } from "./Client";
import type { ExposedFromGame } from "./hooks/exposed";

const Interop = {
	/** DO NOT CALL THIS IF THE STORE IS ALREADY AN OBJECT. */
	initStore() {
		unsafeWindow[fgExposedName] = {};
	},
	initIfRequired() {
		if (typeof unsafeWindow[fgExposedName] !== "object") {
			Interop.initStore();
		}
	},
	get store(): ExposedFromGame {
		if (typeof unsafeWindow[fgExposedName] !== "object") {
			Interop.initStore();
		}
		unsafeWindow[fgExposedName] ??= {};
		return unsafeWindow[fgExposedName];
	},
	get run(): ExposedFromGame["run"] {
		return Interop.store.run;
	}
} as const;

Interop.initIfRequired();

export default Interop;
