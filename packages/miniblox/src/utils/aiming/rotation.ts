import type { AnyPacket } from "@wq2/miniblox-sdk";

export interface IRotation {
	yaw: number;
	pitch: number;
}

export default class Rotation implements IRotation {
	static ZERO = new Rotation(0, 0);

	constructor(
		public yaw: number,
		public pitch: number,
	) {}

	static fromPacket(p?: IRotation): Rotation | undefined {
		if (p?.yaw !== undefined && p?.pitch !== undefined) {
			return new Rotation(p.yaw, p.pitch);
		}
		return undefined;
	}
	static hasRotation(p?: AnyPacket): p is IRotation {
		if (p === undefined) return false;
		return "yaw" in p && "pitch" in p;
	}
}
