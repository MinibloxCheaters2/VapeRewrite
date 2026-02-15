import { Shift, type SingleReplacement } from "@/hooks/replacementTypes";
import { EXPOSED } from "@/utils/patchHelper";

export const TICK_LOOP_REPLACEMENT: SingleReplacement = [
	"fixedUpdate(){game.world.",
	{
		replacement: /*js*/ `
fixedUpdate() {
	${EXPOSED}.emitEvent("tick");
	game.world.
`,
		shift: Shift.REPLACE,
	},
];
