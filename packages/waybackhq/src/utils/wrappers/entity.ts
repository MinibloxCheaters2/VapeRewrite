const entityPromise = import("@wq2/waybackhq-types/src/entity/entity");
export let mod: Awaited<typeof entityPromise>;
export const ready = entityPromise.then((p) => {
	mod = p;
});
