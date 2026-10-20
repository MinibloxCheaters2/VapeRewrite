import type { TeleportTarget } from "@wq2/waybackhq-types/src/net/session";

import CancelableWrapper from "@vape/core/src/event/CancelableWrapper";
import Category from "@vape/core/src/features/modules/api/Category";
import Mod from "@vape/core/src/features/modules/api/Module";

import Bus from "@/Bus";

export default class Test extends Mod {
	name = "Test";
	category = Category.UTILITY;

	@Bus.Subscribe("teleport")
	private lol(wrap: CancelableWrapper<TeleportTarget>) {
		wrap.cancel();
	}
}
