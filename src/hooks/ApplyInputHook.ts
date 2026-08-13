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
	player.applyInput = new Proxy(origApplyInput, {
		apply(target, thisArg, argArray) {
			const ts = thisArg as PlayerMovement;
			const [e, t] = argArray as [SPacketPlayerInput, boolean];
			const plan = RotationManager.currentPlan;
			const movementCorrection = getEffectiveMode(plan.movementCorrection);
			if (
				movementCorrection === MovementCorrection.Silent ||
				movementCorrection === MovementCorrection.Strict
			) {
				[ts.yaw, ts.pitch] = [plan.target.yaw, plan.target.pitch];
			}
			ts.onPlayerUpdate = new Proxy(ts.onPlayerUpdate, {
				apply(target, thisArg, argArray) {},
			});
		},
	});
}
waitForReact().then(hook);
