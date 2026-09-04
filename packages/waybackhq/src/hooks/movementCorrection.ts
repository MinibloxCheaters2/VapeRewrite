import type { Entity } from "@wq2/waybackhq-types/src/entity/entity";

import { Priority } from "@vape/core/event/Bus";
import { ClientPlayer } from "@wq2/waybackhq-types/src/client/clientplayer";

import Bus from "@/Bus";
import RotationManager from "@/utils/aiming/rotate";
import MovementCorrection, {
	doMovementCorrection,
	doSilentMovementCorrection,
} from "@/utils/movement/MovementCorrection";
import { ready as CPlrReady, mod as CPlr } from "@/utils/wrappers/clientplayer";
import { mod } from "@/utils/wrappers/entity";

import Refs, { ready } from "./game";
import createProxy from "@vape/core/utils/helpers/proxy";

const planFor = (player: Entity): NonNullable<typeof RotationManager.currentPlan> | null => {
	const plan = RotationManager.currentPlan;
	return "isLocal" in player &&
		player.isLocal &&
		plan &&
		doMovementCorrection(plan.movementCorrection)
		? plan
		: null;
};
export async function hookJump() {
	await CPlrReady;
	const { ClientPlayer } = CPlr; // CP!!! big fan
	const origJump = ClientPlayer.prototype.jump;
	ClientPlayer.prototype.jump = createProxy(origJump, {
		apply(target, thisArg: ClientPlayer, args) {
			const plan = planFor(thisArg);
			if (!plan) return Reflect.apply(target, thisArg, args);
			const {
				target: { yaw },
			} = plan;
			const correct = doMovementCorrection(plan.movementCorrection);
			const old = thisArg.rotationYaw;
			if (correct) thisArg.rotationYaw = yaw;
			const r = Reflect.apply(target, thisArg, args);
			if (correct) thisArg.rotationYaw = old;
			return r;
		},
	});
}
export async function hook() {
	await ready;
	const { Entity } = mod;

	Bus.on(
		"livingUpdate",
		() => {
			const player = Refs.player;
			if (!player) return;
			const plan = planFor(player);
			if (plan && plan.movementCorrection === MovementCorrection.Silent)
				doSilentMovementCorrection(player.rawInput, plan.target.yaw, player.rotationYaw);
		},
		Priority.HIGHEST,
	);
	const game = Refs.game;
	game.applyMouseLook = createProxy(game.applyMouseLook, {
		apply(target, thisArg: (typeof Refs)["game"], argArray: [apply?: boolean]) {
			const r = Reflect.apply(target, thisArg, argArray);
			const player = thisArg.localPlayer;
			if (!player) return r;
			const plan = planFor(player);
			if (!plan || argArray[0] === false) return r;
			player.rotationYawHead = plan.target.yaw;
			player.renderYawOffset = plan.target.yaw;
			return r;
		},
	});
	const origFlying = Entity.prototype.moveFlying;
	Entity.prototype.moveFlying = createProxy(origFlying, {
		apply(target, thisArg: Entity, args) {
			const plan = planFor(thisArg);
			if (!plan) return Reflect.apply(target, thisArg, args);
			const {
				target: { yaw },
			} = plan;
			const correct = doMovementCorrection(plan.movementCorrection);
			const old = thisArg.rotationYaw;
			if (correct) thisArg.rotationYaw = yaw;
			const r = Reflect.apply(target, thisArg, args);
			if ("rotationYawHead" in thisArg) thisArg.rotationYawHead = yaw;
			if (correct) thisArg.rotationYaw = old;
			return r;
		},
	});
}
hook();
hookJump();
