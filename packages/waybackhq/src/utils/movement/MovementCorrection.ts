import type { Tagged } from "@vape/core/features/config/Settings";
import type { SPacketPlayerInput } from "@wq2/miniblox-sdk";

import RotationManager from "../aiming/rotate";
import AntiCheatDetector, { DetectedAC } from "../helpers/AntiCheatDetector";

/**
 * Corrects your movement.
 * The recommended mode is Auto, which uses the AntiCheatDetector helper to determine what movement fix mode to use.
 */
enum MovementCorrection {
	/**
	 * No movement correction. Feels the best due to not changing movement, but modern AntiCheats can detect this with simulation and etc.
	 * This works on servers with no AC
	 */
	None,
	/**
	 * Silent movement correction. Corrects your movement while also moving in the same direction you are trying to move.
	 * This is only required for servers with the AntiCheat.
	 */
	Silent,
	/** Strict movement correction. Just corrects movement without trying to smooth out the differences, you probably don't want this. */
	Strict,
}

export const ENTRIES = [
	MovementCorrection.Auto,
	MovementCorrection.None,
	MovementCorrection.Silent,
	MovementCorrection.Strict,
] as const;
export const SETTING: (Tagged & { value: MovementCorrection })[] = ENTRIES.map((x) => ({
	tag: MovementCorrection[x],
	value: x,
}));

export function doMovementCorrection(c: MovementCorrection): boolean {
	return c === MovementCorrection.Silent || c === MovementCorrection.Strict;
}
// TODO: bother to adapt this to WaybackHQ
function calculateImpulse(a: boolean, b: boolean, invert = false) {
	return (a ? (invert ? -1 : 1) : 0) + (b ? (invert ? 1 : -1) : 0);
}
export function doSilentMovementCorrection(input: SPacketPlayerInput, oY: number) {
	const rotation = RotationManager.currentPlan;
	if (!rotation) return;

	const z = calculateImpulse(input.up, input.down, true);
	const x = calculateImpulse(input.left, input.right, true);

	const deltaYaw = oY - rotation.target.yaw;

	const newX = x * Math.cos(deltaYaw) - z * Math.sin(deltaYaw);
	const newZ = z * Math.cos(deltaYaw) + x * Math.sin(deltaYaw);

	const movementSideways = Math.round(newX);
	const movementForward = Math.round(newZ);

	const forward = movementForward > 0;
	const backward = movementForward < 0;
	const left = movementSideways > 0;
	const right = movementSideways < 0;

	input.left = left;
	input.right = right;
	input.up = forward;
	input.down = backward;
}

export default MovementCorrection;
