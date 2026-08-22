import type { MinecraftUI } from "@wq2/waybackhq-types/src/ui/minecraft";

const ui = import("@wq2/waybackhq-types/src/ui/minecraft");
export let mcUI: typeof MinecraftUI;
export const ready = ui.then(({ MinecraftUI }) => {
	mcUI = MinecraftUI;
});
