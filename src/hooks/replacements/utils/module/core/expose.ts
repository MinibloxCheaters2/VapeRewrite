import { EXPOSE_AS } from "../../../../../utils/patchHelper";
import { MultipleReplacements, Shift } from "../../../../replacementTypes";

export const EXPOSE_REPLACEMENTS: MultipleReplacements = [
	[
		/let ClientSocket=[a-z|A-z|A-Z]+;/,
		{
			replacement: `${EXPOSE_AS("ClientSocket", "ClientSocket")};`,
			shift: Shift.AFTER,
		},
	],
];
