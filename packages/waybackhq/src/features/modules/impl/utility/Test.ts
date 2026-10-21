import type { TeleportTarget } from "@wq2/waybackhq-types/src/net/session";

import { CancelableWrapper } from "@vape/core";
import { Category } from "@vape/core";
import { Mod } from "@vape/core";

import Bus from "@/Bus";

export default class Test extends Mod {
	name = "Test";
	category = Category.UTILITY;

	@Bus.Subscribe("teleport")
	private lol(wrap: CancelableWrapper<TeleportTarget>) {
		wrap.cancel();
	}
}
