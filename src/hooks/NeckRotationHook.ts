import RotationManager from "@/utils/aiming/rotate";
import { waitForReact } from "@/utils/helpers/waitForReact";
import MovementCorrection, { getEffectiveMode } from "@/utils/movement/MovementCorrection";
import Miniblox from "@/utils/refs/miniblox";
import { ClientEntityPlayer, RenderPlayer } from "@wq2/miniblox-sdk";

let origInit: ClientEntityPlayer["init"];
let origRenderPosAndRot: RenderPlayer["renderPositionAndRotation"];

function hookRenderPlayer(mesh: RenderPlayer) {
	const cRenderPlayer = mesh.constructor.prototype;
	const { player, controls } = Miniblox;
	origRenderPosAndRot = cRenderPlayer.renderPositionAndRotation;
	cRenderPlayer.renderPositionAndRotation = new Proxy(origRenderPosAndRot, {
		apply(target, thisArg, argArray) {
			const ts: RenderPlayer = thisArg;
			if (ts.entity.id !== player.id) return Reflect.apply(target, ts, argArray);
			const plan = RotationManager.currentPlan;
			
			const movementCorrection = getEffectiveMode(plan?.movementCorrection);
			if (
				movementCorrection === MovementCorrection.Silent ||
				movementCorrection === MovementCorrection.Strict
			)
				return;
			// just copied the original code
			ts.position.copy(controls.position);
			ts.neck.rotation.y = RotationManager.activeRotation.yaw ?? controls.yaw;
			ts.headPivot.rotation.x = RotationManager.activeRotation.pitch ?? controls.pitch;
		},
	});
}

export default function hook() {
	const { player } = Miniblox;
	if (player.mesh) hookRenderPlayer(player.mesh);
	origInit = player.init;
	player.init = new Proxy(origInit, {
		apply(target, thisArg, argArray) {
			const result = Reflect.apply(target, thisArg, argArray);
			hookRenderPlayer(player.mesh);
			return result;
		},
	});
}

waitForReact().then(hook);
