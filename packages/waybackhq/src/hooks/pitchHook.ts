import type { PlayerModel } from "@wq2/waybackhq-types/src/client/modelplayer";

import { PlayerRenderer, WorldRenderer } from "@wq2/waybackhq-types/src/client/renderer";

import Bus from "@/Bus";
import RotationManager from "@/utils/aiming/rotate";

import Refs, { ready } from "./game";

let origSetRotationAngles: PlayerModel["setRotationAngles"];

function waitForRenderer() {
	return new Promise<PlayerRenderer>((res) => {
		const renderer = Refs.game.renderer.playerRenderers.get(Refs.player.entityId);
		if (renderer) return res(renderer);
		const orig = Refs.game.renderer.renderPlayers;
		Refs.game.renderer.renderPlayers = new Proxy(orig, {
			apply(target, thisArg: WorldRenderer, argArray) {
				const r = Reflect.apply(target, thisArg, argArray);
				const renderer = thisArg.playerRenderers.get(Refs.player.entityId);
				if (renderer) {
					thisArg.renderPlayers = orig;
					res(renderer);
				}
				return r;
			},
		});
	});
}

function hookRenderer() {
	waitForRenderer().then((renderer) => {
		origSetRotationAngles = renderer.model.setRotationAngles;
		let _smoothedPitch = 0;
		// slightly more complex because there's no rotationPitchHead or anything,
		// so I have to do ts.
		renderer.model.setRotationAngles = new Proxy(origSetRotationAngles, {
			apply(
				target,
				thisArg: PlayerModel,
				args: [
					limbSwing: number,
					limbSwingAmount: number,
					ageInTicks: number,
					netHeadYaw: number,
					headPitch: number,
					swingProgress: number,
					heldItemRight: number,
					isSneak: boolean,
				],
			) {
				const plan = RotationManager.currentPlan;
				if (!plan) {
					_smoothedPitch = args[4];
					return Reflect.apply(target, thisArg, args);
				}
				_smoothedPitch += (plan.target.pitch - _smoothedPitch) * 0.3;
				args[4] = _smoothedPitch;
				return Reflect.apply(target, thisArg, args);
			},
		});
	});
}

export default function hook() {
	Bus.on("join", hookRenderer);
	if (Refs.player) hookRenderer();
}
ready.then(hook);
