import type { SPacketPlayerPosLook } from "@/features/sdk/types/packets";

export default class Rotation {
	static ZERO = new Rotation(0, 0);
	constructor(
		public yaw: number,
		public pitch: number,
	) {}

	static fromPacket(p: SPacketPlayerPosLook): Rotation | undefined {
		if (p.yaw !== undefined && p.pitch !== undefined) {
			return new Rotation(p.yaw, p.pitch);
		}
	}
}
