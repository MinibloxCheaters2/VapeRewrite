const sessionPromise = import("@wq2/waybackhq-types/src/core/mathhelper");
export let mod: Awaited<typeof sessionPromise>;
export const ready = sessionPromise.then((p) => {
	mod = p;
});
