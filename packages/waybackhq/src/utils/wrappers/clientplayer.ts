export let mod: typeof import("@wq2/waybackhq-types/src/client/clientplayer");
export const ready = import("@wq2/waybackhq-types/src/client/clientplayer").then(m => {
	mod = m;
});
