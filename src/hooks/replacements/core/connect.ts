import { Shift, type SingleReplacement } from "@/hooks/replacementTypes";
import { EXPOSED } from "@/utils";

export default [
	'this.socket.on("connect",()=>{',
	{
		replacement: `${EXPOSED}.emitEvent("connect");`,
		shift: Shift.AFTER,
	},
] satisfies SingleReplacement as SingleReplacement;
