import { EXPOSED } from "../../../../../utils/patchHelper";
import { Shift, SingleReplacement } from "../../../../replacementTypes";

export const TICK_LOOP_REPLACEMENT: SingleReplacement = [
	"fixedUpdate(){game.world.",
	{
		replacement: `
fixedUpdate() {
	${EXPOSED}.emitEvent("tick");
	game.world.
`,
	shift: Shift.REPLACE
	}
];
