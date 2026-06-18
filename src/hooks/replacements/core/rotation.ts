import {
	type MultipleReplacements,
	Shift,
	type SingleReplacement,
} from "@/hooks/replacementTypes";
import { EXPOSED, ROTATION_MANAGER } from "@/utils/helpers/patchHelper";

const ACTIVE_YAW = `${ROTATION_MANAGER}.activeRotation.yaw`;
const CURRENT_PLAN = `${ROTATION_MANAGER}.currentPlan`;

export const ROTATION_REPLACEMENTS: MultipleReplacements = [
	[
		"this.yaw-this.",
		{
			replacement: /*js*/ `(${ACTIVE_YAW} ?? this.yaw) - this.`,
			shift: Shift.REPLACE,
		},
	],
	[
		"x.yaw=player.yaw",
		{
			replacement: /*js*/ `x.yaw = ${ACTIVE_YAW} ?? this.yaw`,
			shift: Shift.REPLACE,
		},
	],
	[
		`=this.yaw,this.lastReportedPitch=`,
		{
			replacement: /*js*/ `=(${ACTIVE_YAW} ?? this.yaw),this.lastReportedPitch=`,
			shift: Shift.REPLACE,
		},
	],
	[
		`this.neck.rotation.y=controls.yaw`,
		{
			replacement: /*js*/ `this.neck.rotation.y=(${ACTIVE_YAW} ?? this.yaw)`,
			shift: Shift.REPLACE,
		},
	],
	[
		"yaw:this.yaw",
		{
			replacement: /*js*/ `yaw:(${ACTIVE_YAW} ?? this.yaw)`,
			shift: Shift.REPLACE,
		},
	],
	[
		",this.yaw=h.yaw,this.pitch=h.pitch,",
		{
			replacement: `;
if (!(${CURRENT_PLAN}) || ${EXPOSED}.doMovementCorrection(${CURRENT_PLAN}.movementCorrection)) {
	this.yaw = h.yaw;
	this.pitch = h.pitch;
};`,
			shift: Shift.REPLACE,
		},
	],
	[
		"this.setPositionAndRotation(this.pos.x,this.pos.y,this.pos.z,h.yaw,h.pitch)",
		{
			replacement: `!(${CURRENT_PLAN}) || ${EXPOSED}.doMovementCorrection(${CURRENT_PLAN}.movementCorrection) &&`,
			shift: Shift.BEFORE,
		},
	],
];

// PlayerMovement#updatePlayerMoveState
export const SILENT_MOVEMENT_CORRECTION: SingleReplacement = [
	"this.moveStrafe = (h.right ? 1 : 0) + (h.left ? -1 : 0),",
	{
		replacement: `if (${CURRENT_PLAN} !== undefined
&& ${EXPOSED}.getEffectiveMode(${CURRENT_PLAN}.movementCorrection) === ${EXPOSED}.MovementCorrection.Silent) {
	${EXPOSED}.doSilentMovementCorrection(h, this.yaw);
}`,
		shift: Shift.BEFORE,
	},
];
