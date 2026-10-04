import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Refs from "@/utils/refs/game";
import createProxy from "@vape/core/utils/helpers/proxy";

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
