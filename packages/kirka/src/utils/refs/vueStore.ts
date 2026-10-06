import { expose } from "@vape/core/exposed";
import initOrR from "@vape/core/src/utils/helpers/initOrR";

// oxlint-disable-next-line no-unassigned-vars
let _store;
// oxlint-disable-next-line no-unassigned-vars
let _state;

const VueStore = {
	/** doesn't work until in game */
	get value() {
		return initOrR(_store, () => {
			return Object.values(document.querySelector("#app"))?.[0]?.$store;
		});
	},
	get state() {
		return initOrR(_state, () => VueStore.value?.state);
	}
};
expose("vue", () => VueStore);
export default VueStore;
