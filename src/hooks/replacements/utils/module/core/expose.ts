import { EXPOSE_AS } from "../../../../../utils/patchHelper";
import { MultipleReplacements, Shift } from "../../../../replacementTypes";

export const EXPOSE_REPLACEMENTS: MultipleReplacements = [
	[
		"//# sourceMappingURL=index-",
		{
			replacement: `${EXPOSE_AS("run", "((fn, ...args) => fn(t => eval(t), ...args));")}`,
			shift: Shift.BEFORE
		}
	],
];
