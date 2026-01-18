import { type MultipleReplacements, Shift } from "../../../replacementTypes";
import { EXPOSED, MOD_MANAGER } from "../../../../utils/patchHelper";

const PHASE = `${MOD_MANAGER}.phase`;

export const PHASE_REPLACEMENTS: MultipleReplacements = [
	[
		`calculateXOffset(A,this.getEntityBoundingBox(),g.x)`,
		{
			replacement: `${PHASE}.enabled ? g.x : calculateXOffset(A,this.getEntityBoundingBox(),g.x)`,
			shift: Shift.REPLACE,
		},
	],
	// replace keypresseddump with smth later
	[
		`calculateYOffset(A,this.getEntityBoundingBox(),g.y)`,
		{
			replacement: ` ${PHASE}.enabled && !${MOD_MANAGER}.scaffold.enabled && ${EXPOSED}.dump.keyPressedPlayer("shift") ? g.y : calculateYOffset(A,this.getEntityBoundingBox(),g.y)`,
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
