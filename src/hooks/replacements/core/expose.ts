import { MultipleReplacements, Shift } from "@/hooks/replacementTypes";
import { EXPOSE_AS } from "@/utils/patchHelper";

export const EXPOSE_REPLACEMENTS: MultipleReplacements = [
	[
		"//# sourceMappingURL=index-",
		{
			replacement: `${EXPOSE_AS("run", "((fn, ...args) => fn(t => eval(t), ...args));")}`,
			shift: Shift.BEFORE
		}
	],
];
