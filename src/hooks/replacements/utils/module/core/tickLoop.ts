import { EXPOSED } from "../../../../../utils/patchHelper";
import { Shift, SingleReplacement } from "../../../../replacementTypes";

export const TICK_LOOP_REPLACEMENT: SingleReplacement = [
	"+=h*y+u*x",
	{
		replacement: `
if (this == player) {
	${EXPOSED}.emitEvent("tick");
}
`,
	shift: Shift.AFTER
	}
];
