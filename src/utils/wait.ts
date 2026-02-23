/**
 * Provides utilities, mainly for use inside of suspendable event handlers.
 * @module
 */
import Bus from "@/Bus";

/**
 * Waits for {@linkcode ticks} tick(s)
 * @param ticks how many ticks to wait
 * @returns a promise that always resolves to how long the promise waited for in ticks, should always be `ticks` and always will be >= `ticks`.
 */
export default function waitTicks(ticks: number) {
	let t = 0;
	return new Promise<number>((res, _) => {
		Bus.onceB("gameTick", () => {
			if (t++ >= ticks) {
				res(t);
				return true;
			}
		});
	});
}

/**
 * @returns a promise that resolves after a single tick.
 */
export function waitTick() {
	let t = 0;
	return new Promise<number>((res, _) => {
		Bus.once("gameTick", () => {
			t++;
			res(t);
		});
	});
}
