import { type MultipleReplacements, Shift } from "@/hooks/replacementTypes";
import { ROTATION_MANAGER } from "@/utils/patchHelper";

const ACTIVE_YAW = `${ROTATION_MANAGER}.activeRotation.yaw`;

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
	// stops applyInput from changing our yaw and correcting our movement,
	// but that makes the server setback us when we go too far
	// from the predicted pos since we don't do movement correction
	// TODO, would it be better to send an empty input packet with the sendYaw instead?
	// I can't be asked to work on fixing this not working on the prediction ac
	[
		"this.yaw=h.yaw,this.pitch=h.pitch,",
		{
			replacement: "",
			shift: Shift.REPLACE,
		},
	],
	[
		"this.setPositionAndRotation(this.pos.x,this.pos.y,this.pos.z,h.yaw,h.pitch)",
		{
			replacement: "undefined",
			shift: Shift.REPLACE,
		},
	],
];
