import Refs from "@/hooks/game";

import rotate from "../aiming/rotate";

export function getMovementDirection(): [number, number] {
	const { localPlayer: player } = Refs.game;
	const strafe = player.moveStrafing;
	const forward = player.moveForward;
	const len = Math.sqrt(strafe * strafe + forward * forward);
	if (len < 1e-4) return [0, 0];

	const yaw = (rotate.activeRotation.yaw * Math.PI) / 180;
	const dx = (strafe * Math.cos(yaw) - forward * Math.sin(yaw)) / len;
	const dz = (forward * Math.cos(yaw) + strafe * Math.sin(yaw)) / len;
	return [dx, dz];
}
export default function getMovement(speed: number): [number, number] {
	return getMovementDirection().map((x) => x * speed) as [number, number];
}
