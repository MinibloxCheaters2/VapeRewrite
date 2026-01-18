import { Vector3 } from "three/src/Three.Core.js";

export class SPacketPlayerInput {
	sequenceNumber: number;
	left: boolean;
	right: boolean;
	up: boolean;
	down: boolean;
	yaw: number;
	pitch: number;
	jump: boolean;
	sneak: boolean;
	sprint: boolean;
	pos: Vector3;
}

export class CPacketRespawn {
	notDeath?: boolean;
	client?: boolean;
	dimension?: string;
}

export class CPacketPlayerReconciliation {
	x: number;
	y: number;
	z: number;
	yaw: number;
	pitch: number;
	lastProcessedInput: number;
	reset?: boolean;
}
