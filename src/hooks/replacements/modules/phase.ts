import { MOD_MANAGER } from "@/utils/helpers/patchHelper";
import { type MultipleReplacements, Shift } from "../../replacementTypes";

const PHASE = `${MOD_MANAGER}.phase`;
const SCAFFOLD = `${MOD_MANAGER}.scaffold`;

export const PHASE_REPLACEMENTS: MultipleReplacements = [
	[
		`calculateXOffset(R,w,g.x)`,
		{
			replacement: `${PHASE}.enabled ? g.x : calculateXOffset(R,w,g.x)`,
			shift: Shift.REPLACE,
		},
	],

	[
		`calculateYOffset(R,v,g.y)`,
		{
			replacement: `${PHASE}.enabled
				&& !${SCAFFOLD}.enabled
				&& keyPressedPlayer("Shift")
					? g.y
					: calculateYOffset(R,v,g.y)
				`,
			shift: Shift.REPLACE,
		},
	],

	[
		`calculateZOffset(R,w,g.z)`,
		{
			replacement: `${PHASE}.enabled ? g.z : calculateZOffset(R,w,g.z)`,
			shift: Shift.REPLACE,
		},
	],

	[
		/pushOutOfBlocks\([\w,]\)\{/,
		{
			replacement: `if (${PHASE}.enabled) return;`,
			shift: Shift.AFTER,
		},
	],
];
