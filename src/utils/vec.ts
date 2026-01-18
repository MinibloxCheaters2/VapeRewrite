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
}

/** A really basic Vector2 class. */
export class SimpleVec2 {
	public static readonly ZERO = new SimpleVec2(/* all coords default to 0 */);
	constructor(
		public x: number = 0,
		public y: number = 0,
	) {}
}
