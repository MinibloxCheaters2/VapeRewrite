import type { EntityLivingBase } from "@wq2/miniblox-sdk";

/**
 * How long a stamped target is considered "recent" before it's purged.
 * Lua purges every tick (~50ms); we keep a small margin so the HUD
 * doesn't flicker between attack ticks.
 */
const TARGET_TTL_MS = 200;

const targets = new Map<EntityLivingBase, number>();

/** Stamp an entity as the most-recently-attacked target. */
export function stampTarget(e: EntityLivingBase): void {
	targets.set(e, Date.now());
}

/** Return all alive stamped targets that were attacked within the TTL. */
export function getRecentTargets(now = Date.now()): EntityLivingBase[] {
	const recent: EntityLivingBase[] = [];
	for (const [e, t] of targets) {
		if (now - t > TARGET_TTL_MS || e.dead) {
			targets.delete(e);
			continue;
		}
		recent.push(e);
	}
	return recent;
}

/** Return the single most recently stamped target, or null. */
export function getMostRecentTarget(now = Date.now()): EntityLivingBase | null {
	const recent = getRecentTargets(now);
	let newest: EntityLivingBase | null = null;
	let newestTime = -Infinity;
	for (const e of recent) {
		const t = targets.get(e) ?? -Infinity;
		if (t > newestTime) {
			newest = e;
			newestTime = t;
		}
	}
	return newest;
}
