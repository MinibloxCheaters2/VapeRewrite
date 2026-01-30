import { vapeName } from "@/Client";
import { Shift, type SingleReplacement } from "@/hooks/replacementTypes";

export default [
	'VERSION$1," | ",',
	{
		replacement: `"${vapeName} v${GM_info.script.version} | ",`,
		shift: Shift.AFTER,
	},
] satisfies SingleReplacement;
