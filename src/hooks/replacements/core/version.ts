import { clientName } from "@/Client";
import { Shift, type SingleReplacement } from "@/hooks/replacementTypes";

export default [
	'VERSION$1," | ",',
	{
		replacement: `"${clientName} v${GM_info.script.version} | ",`,
		shift: Shift.AFTER,
	},
] satisfies SingleReplacement;
