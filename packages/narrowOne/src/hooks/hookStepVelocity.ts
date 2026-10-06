import { Cancelable } from "@vape/core/index";
import { showNotification } from "@vape/core/ui/notifications";
import createProxy from "@vape/core/utils/helpers/proxy";

import Bus from "@/Bus";
import Refs, { anyReady } from "@/utils/refs/game";

let origStepVelocity: () => void;

export default function hookStepVelocity() {
	const { player } = Refs;
	if (!player) {
		showNotification("Hook", "No player, can't hook stepVelocity", "alert", 0.5e3);
		return;
	}
	const rBody = Object.getPrototypeOf(player.rigidBody);
	origStepVelocity = rBody.stepVelocity;
	rBody.stepVelocity = createProxy(origStepVelocity, {
		apply(target, thisArg, argArray) {
			// `player` could be outdated
			if (thisArg !== Refs.player.rigidBody) return Reflect.apply(target, thisArg, argArray);
			const c = new Cancelable();
			Bus.emit("preStepVelocity", c);
			if (!c.canceled) {
				const result = Reflect.apply(target, thisArg, argArray);
				Bus.emit("postStepVelocity");
				return result;
			}
		},
	});
}
anyReady.then(() => {
	hookStepVelocity();
});
