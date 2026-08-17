import RotationManager from "@/utils/aiming/rotate";
import { waitForReact } from "@/utils/helpers/waitForReact";
import MovementCorrection, { getEffectiveMode } from "@/utils/movement/MovementCorrection";
import Miniblox from "@/utils/refs/miniblox";
import { PlayerMovement, SPacketPlayerInput } from "@wq2/miniblox-sdk";

let origApplyInput: PlayerMovement["applyInput"];

/**
 * Hooks `applyInput` in order to do movement fix and stuff
 */
export default function hook() {
	const { player } = Miniblox;
	origApplyInput = player.applyInput;
	console.log(player, player.applyInput);
	player.applyInput = new Proxy(origApplyInput, {
		apply(target, thisArg, argArray) {
			const ts = thisArg as PlayerMovement;
			//const [oldYaw, oldPitch, oldJumping] = [ts.yaw, ts.pitch, ts.jumping];
			const ret = Reflect.apply(target, ts, argArray);
			const [e, _] = argArray as [SPacketPlayerInput, boolean];
			const plan = RotationManager.currentPlan;
			if (!plan) return;
			const movementCorrection = getEffectiveMode(plan.movementCorrection);
			console.log(plan, movementCorrection);
			if (
				movementCorrection === MovementCorrection.Silent ||
				movementCorrection === MovementCorrection.Strict
			) {
				[ts.yaw, ts.pitch] = [plan.target.yaw, plan.target.pitch];
			}
			ts.moveStrafe = +!!e.right + (e.left ? -1 : 0);
			ts.moveForward = (e.up ? -1 : 0) + +!!e.down;
			return ret;
		},
	});
}
waitForReact().then(hook);
