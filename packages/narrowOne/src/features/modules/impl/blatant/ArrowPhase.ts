import { Category } from "@vape/core";
import { Mod } from "@vape/core";

import Refs from "@/utils/refs/game";
import { createProxy } from "@vape/core";

let orig, patchedProto;

export default class ArrowPhase extends Mod {
	name = "ArrowPhase";
	category = Category.BLATANT;
	protected onEnable(): void {
		const { instance: game } = Refs;
		if (!game) return;
		const arrowPhysics = game.arrowManager.physics;
		const proto = Object.getPrototypeOf(arrowPhysics);
		patchedProto = proto;
		orig = proto.rayCastMapColliders;
		proto.rayCastMapColliders = createProxy(proto.rayCastMapColliders, {
			apply(/*target, thisArg, argArray*/) {
				return null;
			},
		});
	}
	protected onDisable(): void {
		patchedProto.rayCastMapColliders = orig;
	}
}
