import type { TeleportTarget } from "@wq2/waybackhq-types/src/net/session";

import CancelableWrapper from "@vape/core/event/CancelableWrapper";
import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Bus from "@/Bus";
import Refs from "@/hooks/game";

export default class Test extends Mod {
	name = "Test";
	category = Category.UTILITY;

	@Bus.Subscribe("teleport")
	private lol(wrap: CancelableWrapper<TeleportTarget>) {
		wrap.cancel();
	}
}
