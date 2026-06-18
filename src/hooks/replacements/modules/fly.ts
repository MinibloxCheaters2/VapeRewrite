import { Shift, type SingleReplacement } from "@/hooks/replacementTypes";
import { EXPOSED } from "@/utils";

export const DESYNC_REPLACEMENT: SingleReplacement = [
	"this.inputSequenceNumber++",
	{
		replacement: /*js*/ `${EXPOSED}.DesyncManager.desync ? this.inputSequenceNumber : this.inputSequenceNumber++`,
		shift: Shift.REPLACE,
	},
];
