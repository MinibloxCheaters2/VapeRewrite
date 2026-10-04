const promise = import("@wq2/waybackhq-types/src/client/renderer");
export let mod: Awaited<typeof promise>;
export const ready = promise.then((p) => {
	mod = p;
});
