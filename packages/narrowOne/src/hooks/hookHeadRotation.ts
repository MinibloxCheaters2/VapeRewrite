import game from "@/utils/refs/game";
import { ready } from "./gameHook";
import RotationManager from "@/utils/aiming/rotate";

let skeletonProto: any = null;

export function hookHeadPitch() {
	const skel = game.player?.skeleton;
	if (!skel || skeletonProto) return;

	skeletonProto = Object.getPrototypeOf(skel);
	const orig = skeletonProto.setLookRotY;
	skeletonProto.setLookRotY = new Proxy(orig, {
		apply(target, thisArg, args) {
			if (thisArg === game.player?.skeleton) {
				const plan = RotationManager.currentPlan;
				if (plan) args[0] = -plan.target.pitch;
			}
			return Reflect.apply(target, thisArg, args);
		},
	});
}

export function hookHeadYaw() {
}

export default function hookHeadRotation() {
	hookHeadYaw();
	hookHeadPitch();
}

ready.then(hookHeadRotation);
