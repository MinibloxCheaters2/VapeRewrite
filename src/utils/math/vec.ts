import type { Vector3 } from "three";
import type { PBFloatVector3 } from "@/features/sdk/types/packets";

/** A really basic Vector3 class. */
export class SimpleVec3 {
	public static readonly ZERO = new SimpleVec3(
		/* all coords defaults to 0 */
	);
	constructor(
		public x: number = 0,
		public y: number = 0,
		public z: number = 0,
	) {}

	static fromFloatVec3(v: PBFloatVector3): SimpleVec3 {
		return new SimpleVec3(v.x, v.y, v.z);
	}
	static fromThreeVec3(v: Vector3): SimpleVec3 {
		return new SimpleVec3(v.x, v.y, v.z);
	}
}

/** A really basic Vector2 class. */
export class SimpleVec2 {
	public static readonly ZERO = new SimpleVec2(/* all coords default to 0 */);
	constructor(
		public x: number = 0,
		public y: number = 0,
	) {}
}
