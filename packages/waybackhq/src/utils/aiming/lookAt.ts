/**
 * Literally copied and pasted src/ai/bot.js from the game's `updateAim` function.
 * Removed some smoothing stuff but that's effectively it.
 * @module
 */

import { Entity } from "@wq2/waybackhq-types/src/entity/entity";
import Rotation from "./rotation";
import { mod as MathHelper } from "@/utils/wrappers/mathhelper";
import { SimpleVec3 } from "@vape/core/utils/math/vec";

export function lookAtEntity(from: SimpleVec3, eyeHeight: number, target: Entity) {
	const dx = target.posX - from.x;
    const dz = target.posZ - from.z;
    const dy = (target.posY + target.getEyeHeight()) - (from.y + eyeHeight);
	const distance = Math.sqrt(dx * dx + dz * dz);
	return lookAt(dx, dy, dz, distance);
}

/**
 * @param dx target X - self X
 * @param dy target Y - self Y
 * @param dz target Z - self Z
 * @param distance overall distance, `sqrt(dx * dx + dz * dz)`
 */
export default function lookAt(
	dx: number,
	dy: number,
	dz: number,
	distance: number
) {
    const targetYaw = (Math.atan2(dz, dx) * 180.0) / Math.PI - 90.0;
    const targetPitch = -(Math.atan2(dy, distance) * 180.0) / Math.PI;

    // const jitter = (1.0 - this.difficulty) * 6.0;
    // this.aimNoiseYaw += (rand.nextFloat() - 0.5) * jitter;
    // this.aimNoisePitch += (rand.nextFloat() - 0.5) * jitter * 0.4;
    // this.aimNoiseYaw *= 0.8;
    // this.aimNoisePitch *= 0.8;

    // const smoothing = 0.35 + this.difficulty * 0.5;
	let yaw = MathHelper.wrapAngleTo180(
		targetYaw/* + this.aimNoiseYaw - this.rotationYaw*/
	);
    const pitch = MathHelper.clamp(targetPitch, -90, 90);
    // this.rotationYaw += yaw * smoothing;
    // this.rotationPitch += pitch * smoothing;
    // this.rotationPitch = MathHelper.clamp(this.rotationPitch, -90, 90);
    // this.rotationYawHead = this.rotationYaw;
	return new Rotation(yaw, pitch);
}
