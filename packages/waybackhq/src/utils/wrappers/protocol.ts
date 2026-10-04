export let mod: typeof import("@wq2/waybackhq-types/src/net/protocol");
export const ready = import("@wq2/waybackhq-types/src/net/protocol").then((m) => {
	mod = m;
});
