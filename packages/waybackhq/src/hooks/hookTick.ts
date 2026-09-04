import type { ClientPlayer } from "@wq2/waybackhq-types/src/client/clientplayer";

import Cancelable from "@vape/core/event/Cancelable";
import logger from "@vape/core/utils/logging/loggers";
import { Entity } from "@wq2/waybackhq-types/src/entity/entity";
import { Game } from "@wq2/waybackhq-types/src/game";

import Bus from "@/Bus";
import { mod as CPlr, ready as cplrReady } from "@/utils/wrappers/clientplayer";

import Refs, { ready } from "./game";
import createProxy from "@vape/core/utils/helpers/proxy";

let origGameTick: Game["runTick"];
let origOnUpdate: Entity["onUpdate"];
let origLivingUpdate: ClientPlayer["onLivingUpdate"];

interface RevokableProxy<T> {
	proxy: T;
	revoke(): void;
}

/**
 * in most cases, the script is going to run before localPlayer is made.
 * we just wait for a match to start and then run hook player tick.
 * also, unlike in Miniblox,
 * the local player doesn't get initialized first and isn't reused across matches.
 */
function hookPlayerCreate() {
	let bnm: RevokableProxy<Game["beginNetworkMatch"]>;
	let sm: RevokableProxy<Game["startMatch"]>;
	sm = Proxy.revocable(Refs.game.startMatch, {
		apply(target, thisArg, argArray) {
			const r = Reflect.apply(target, thisArg, argArray);
			Bus.emit("join");
			return r;
		},
	});
	Refs.game.startMatch = sm.proxy;
	bnm = Proxy.revocable(Refs.game.beginNetworkMatch, {
		apply(target, thisArg, argArray) {
			const r = Reflect.apply(target, thisArg, argArray);
			Bus.emit("join");
			return r;
		},
	});
	Refs.game.beginNetworkMatch = bnm.proxy;
}

export function hookGameTick() {
	origGameTick = Refs.game.runTick;
	Refs.game.runTick = createProxy(origGameTick, {
		apply(target, thisArg, argArray) {
			const r = Reflect.apply(target, thisArg, argArray);
			Bus.emit("gameTick");
			return r;
		},
	});
}

let playerTickHooked = false;
export function hookPlayerTick() {
	if (!playerTickHooked) {
		Bus.on("join", hookPlayerTick);
		playerTickHooked = true;
	}
	if (!Refs.player) {
		logger.info("player not available. waiting until match to hook player tick.");
		return;
	}
	origOnUpdate = Refs.player.onUpdate;
	Refs.player.onUpdate = createProxy(origOnUpdate, {
		apply(target, thisArg, argArray) {
			const c = new Cancelable();
			Bus.emit("playerTick", c);
			if (c.canceled) return;
			const r = Reflect.apply(target, thisArg, argArray);
			return r;
		},
	});
}

export function hookLivingUpdate() {
	cplrReady.then(() => {
		const { ClientPlayer } = CPlr;
		origLivingUpdate = ClientPlayer.prototype.onLivingUpdate;
		ClientPlayer.prototype.onLivingUpdate = createProxy(origLivingUpdate, {
			apply(target, thisArg: ClientPlayer, argArray: []) {
				const c = new Cancelable();
				Bus.emit("livingUpdate", c);
				if (c.canceled) return;
				const r = Reflect.apply(target, thisArg, argArray);
				Bus.emit("afterLivingUpdate");
				return r;
			},
		});
	});
}

ready.then(() => {
	hookPlayerCreate();
	hookGameTick();
	hookPlayerTick();
	hookLivingUpdate();
});
