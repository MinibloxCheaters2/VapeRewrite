import { CancelableWrapper } from "@vape/core/index";
import { showNotification } from "@vape/core/ui/notifications";
import createProxy from "@vape/core/utils/helpers/proxy";

import Bus from "@/Bus";
import game from "@/utils/refs/game";

import { ready } from "./gameHook";
import { ServerMove } from "@/events";

let orig;

export function hook() {
	if (!game.player) {
		showNotification("Hooks", "player missing, can't hook send pos", "alert", 1.5e3);
		return;
	}
	const prototype = Object.getPrototypeOf(game.player);
	orig = prototype.sendPlayerDataToServer;
	prototype.setServerData = createProxy(prototype.setServerData, {
		apply(
			target,
			plr,
			argArray: [
				pX: number,
				pY: number,
				pZ: number,
				yaw: number,
				pitch: number,
				setback: boolean,
			],
		) {
			const wrap = new CancelableWrapper<ServerMove>({
				player: plr,
				pos: [argArray[0], argArray[1], argArray[2]],
				rot: [argArray[3], argArray[4]],
				setback: argArray[5]
			});
			Bus.emit("serverMove", wrap);
			if (!wrap.canceled) Reflect.apply(target, plr, argArray);
		},
	});
	prototype.sendPlayerDataToServer = createProxy(orig, {
		apply(target, thisArg, argArray) {
			const [origPos, origRot] = [thisArg.pos, thisArg.lookRot];
			const [pos, rot] = [thisArg.pos.clone(), thisArg.lookRot.clone()];
			const c = new CancelableWrapper({
				pos,
				rot,
			});
			Bus.emit("sendPos", c);
			// reason for setting `this.noclip`: it effectively makes the method do nothing.
			// idk why I don't just *not* send it if its canceled, but I guess.
			[thisArg.pos, thisArg.lookRot] = [pos, rot];
			const r = c.canceled ? undefined : Reflect.apply(target, thisArg, argArray);
			[thisArg.pos, thisArg.lookRot] = [origPos, origRot];
			return r;
		},
	});
}

// we only need game for this, main is extra.
ready.then(hook);
