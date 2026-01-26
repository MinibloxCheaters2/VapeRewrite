import { MOD_MANAGER } from "@/utils/patchHelper";
import { type MultipleReplacements, Shift } from "../../replacementTypes";

const NOSLOW = `${MOD_MANAGER}.noSlow`;

export const NOSLOW_REPLACEMENTS: MultipleReplacements = [
	[
		"updatePlayerMoveState(),this.isUsingItem()",
		{
			replacement: `updatePlayerMoveState(),(this.isUsingItem() && !${NOSLOW}.enabled)`,
			shift: Shift.REPLACE,
		},
	],

	[
		"S&&!this.isUsingItem()",
		{
			replacement: `S&&!(this.isUsingItem() && !${NOSLOW}.enabled)`,
			shift: Shift.REPLACE,
		},
	],
];
