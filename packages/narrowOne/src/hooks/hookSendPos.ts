import { CancelableWrapper } from "@vape/core/index";
import { showNotification } from "@vape/core/ui/notifications";
import createProxy from "@vape/core/utils/helpers/proxy";

import Bus from "@/Bus";
import game from "@/utils/refs/game";

import { ready } from "./gameHook";

let orig;

export function hook() {
	if (!game.player) {
		showNotification("Hooks", "player missing, can't hook send pos", "alert", 1.5e3);
		return;
	}
	const prototype = Object.getPrototypeOf(game.player);
	orig = prototype.sendPlayerDataToServer;
	prototype.sendPlayerDataToServer = createProxy(orig, {
		apply(target, thisArg, argArray) {
			const [origPos, origRot, origNoClip] = [
				thisArg.pos, thisArg.lookRot,
				thisArg.noClip
			];
			const [pos, rot] = [thisArg.pos.clone(), thisArg.lookRot.clone()];
			const c = new CancelableWrapper({
				pos,
				rot,
			});
			Bus.emit("sendPos", c);
			// reason for setting `this.noclip`: it effectively makes the method do nothing.
			// idk why I don't just *not* send it if its canceled, but I guess.
			[thisArg.noClip, thisArg.pos, thisArg.lookRot] = [
				c.canceled,
				pos,
				rot
			];
			const r = Reflect.apply(target, thisArg, argArray);
			[thisArg.noClip, thisArg.pos, thisArg.lookRot] = [
				origNoClip,
				origPos,
				origRot
			];
			return r;
		},
	});
}

// we only need game for this, main is extra.
ready.then(hook);
