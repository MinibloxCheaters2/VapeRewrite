export let mod: typeof import("three");
export const ready = import("@wq2/waybackhq-types/vendor/three.module").then((m) => {
	mod = m;
});
