import type { ClientPlayer } from "@wq2/waybackhq-types/src/client/clientplayer";
import type { Entity } from "@wq2/waybackhq-types/src/entity/entity";

import RotationManager from "@/utils/aiming/rotate";
import MovementCorrection, {
	doMovementCorrection,
	doSilentMovementCorrection,
} from "@/utils/movement/MovementCorrection";
import { mod as CPlr } from "@/utils/wrappers/clientplayer";
import { mod } from "@/utils/wrappers/entity";

import Refs, { ready } from "./game";

const planFor = (player: Entity): NonNullable<typeof RotationManager.currentPlan> | null => {
	const plan = RotationManager.currentPlan;
	return "isLocal" in player &&
		player.isLocal &&
		plan &&
		doMovementCorrection(plan.movementCorrection)
		? plan
		: null;
};

export function hook() {
	const { ClientPlayer } = CPlr;
	const { Entity } = mod;

	const original = ClientPlayer.prototype.onLivingUpdate;
	ClientPlayer.prototype.onLivingUpdate = new Proxy(original, {
		apply(target, thisArg: ClientPlayer, args: []) {
			const plan = planFor(thisArg);
			if (plan && plan.movementCorrection === MovementCorrection.Silent)
				doSilentMovementCorrection(thisArg.rawInput, plan.target.yaw, thisArg.rotationYaw);
			return Reflect.apply(target, thisArg, args);
		},
	});

	const game = Refs.game;
	game.applyMouseLook = new Proxy(game.applyMouseLook, {
		apply(target, thisArg: (typeof Refs)["game"], argArray: [apply?: boolean]) {
			const r = Reflect.apply(target, thisArg, argArray);
			const player = thisArg.localPlayer;
			const plan = planFor(player);
			if (!plan || argArray[0] === false) return r;
			player.rotationYawHead = plan.target.yaw;
			return r;
		},
	});
	const origFlying = Entity.prototype.moveFlying;
	Entity.prototype.moveFlying = new Proxy(origFlying, {
		apply(target, thisArg: Entity, args) {
			const plan = planFor(thisArg);
			if (!plan) return Reflect.apply(target, thisArg, args);
			const correct = doMovementCorrection(plan.movementCorrection);
			const old = thisArg.rotationYaw;
			if (correct) thisArg.rotationYaw = plan.target.yaw;
			const r = Reflect.apply(target, thisArg, args);
			if ("rotationYawHead" in thisArg) thisArg.rotationYawHead = plan.target.yaw;
			if (correct) thisArg.rotationYaw = old;
			return r;
		},
	});
}

ready.then(hook);
