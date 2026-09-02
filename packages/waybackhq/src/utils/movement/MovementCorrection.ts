import type { Tagged } from "@vape/core/features/config/Settings";
import type { SPacketPlayerInput } from "@wq2/miniblox-sdk";

import RotationManager from "../aiming/rotate";

/**
 * Corrects your movement.
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

function calculateImpulse(a: boolean, b: boolean) {
	return (a ? 1 : 0) - (b ? 1 : 0);
}

interface Input {
	forward: boolean;
	back: boolean;
	left: boolean;
	right: boolean;
}

export function doSilentMovementCorrection(input: Input, movementYaw: number, viewYaw: number) {
	if (viewYaw == null) return;
	const z = calculateImpulse(input.forward, input.back);
	const x = calculateImpulse(input.left, input.right);
	if (z === 0 && x === 0) return;

	const deltaYaw = ((viewYaw - movementYaw) * Math.PI) / 180;
	const cos = Math.cos(deltaYaw);
	const sin = Math.sin(deltaYaw);

	const newX = x * cos - z * sin;
	const newZ = z * cos + x * sin;
	const movementSideways = Math.round(newX);
	const movementForward = Math.round(newZ);

	input.forward = movementForward > 0;
	input.back = movementForward < 0;
	input.left = movementSideways > 0;
	input.right = movementSideways < 0;
}

export default MovementCorrection;
