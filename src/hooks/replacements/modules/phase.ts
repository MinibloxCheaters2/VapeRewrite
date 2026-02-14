import { DMP, MOD_MANAGER } from "@/utils/patchHelper";
import { type MultipleReplacements, Shift } from "../../replacementTypes";

const PHASE = `${MOD_MANAGER}.phase`;
const SCAFFOLD = `${MOD_MANAGER}.scaffold`;

export const PHASE_REPLACEMENTS: MultipleReplacements = [
	[
		`calculateXOffset(A,this.getEntityBoundingBox(),g.x)`,
		{
			replacement: `${PHASE}.enabled ? g.x : calculateXOffset(A,this.getEntityBoundingBox(),g.x)`,
			shift: Shift.REPLACE,
		},
	],

	[
		`calculateYOffset(A,this.getEntityBoundingBox(),g.y)`,
		{
			replacement: `${PHASE}.enabled
				&& !${SCAFFOLD}.enabled
				&& ${DMP("keyPressedPlayer")}("Shift")
					? g.y
					: calculateYOffset(A,this.getEntityBoundingBox(),g.y)
				`,
			shift: Shift.REPLACE,
		},
	],

	[
		`calculateZOffset(A,this.getEntityBoundingBox(),g.z)`,
		{
			replacement: `${PHASE}.enabled ? g.z : calculateZOffset(A,this.getEntityBoundingBox(),g.z)`,
			shift: Shift.REPLACE,
		},
	],

	[
		`pushOutOfBlocks(u,h,p){`,
		{
			replacement: `if (${PHASE}.enabled) return;`,
			shift: Shift.AFTER,
		},
	],
];
