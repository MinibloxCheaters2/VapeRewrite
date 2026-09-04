import { Category } from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { EntityPlayer } from "@wq2/waybackhq-types/src/entity/player";

import Bus from "@/Bus";
import Refs from "@/hooks/game";
import createProxy from "@vape/core/utils/helpers/proxy";

let origAttack: EntityPlayer["attackTargetEntityWithCurrentItem"];

export default class KeepSprint extends Mod {
	name = "KeepSprint";
	category = Category.COMBAT;

	@Bus.Subscribe("join")
	onJoin() {
		origAttack = Refs.player.attackTargetEntityWithCurrentItem;
		Refs.player.attackTargetEntityWithCurrentItem = createProxy(origAttack, {
			apply(target, ts: EntityPlayer, argArray: []) {
				if (ts.sprinting) {
					ts.motionX /= 0.6;
					ts.motionZ /= 0.6;
				}
				return Reflect.apply(target, ts, argArray);
			},
		});
	}

	onDisable() {
		Refs.player.attackTargetEntityWithCurrentItem = origAttack;
	}
}
