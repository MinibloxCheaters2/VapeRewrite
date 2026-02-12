import { type MultipleReplacements, Shift } from "@/hooks/replacementTypes";
import { EXPOSE_AS, EXPOSED } from "@/utils/patchHelper";

export const EXPOSE_REPLACEMENTS: MultipleReplacements = [
	[
		"//# sourceMappingURL=index-",
		{
			replacement: `${EXPOSE_AS("run", "((fn, ...args) => fn(t => eval(t), ...args));")}
${EXPOSED}.ChatHook.init();
`,
			shift: Shift.BEFORE,
		},
	],
];
