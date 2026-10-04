const sessionPromise = import("@wq2/waybackhq-types/src/entity/entityliving");
export let mod: Awaited<typeof sessionPromise>;
export const ready = sessionPromise.then((p) => {
	mod = p;
});
