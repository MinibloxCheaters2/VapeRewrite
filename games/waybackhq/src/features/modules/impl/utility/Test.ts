import type { TeleportTarget } from "@wq2/waybackhq-types/src/net/session";

import { CancelableWrapper } from "@vape-rewrite/core";
import { Category } from "@vape-rewrite/core";
import { Mod } from "@vape-rewrite/core";

import Bus from "@/Bus";

export default class Test extends Mod {
	name = "Test";
	category = Category.UTILITY;

	@Bus.Subscribe("teleport")
	private lol(wrap: CancelableWrapper<TeleportTarget>) {
		wrap.cancel();
	}
}
