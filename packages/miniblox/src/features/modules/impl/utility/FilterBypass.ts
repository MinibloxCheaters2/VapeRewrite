import type CancelableWrapper from "@vape/core/event/CancelableWrapper";
import type { C2SPacket } from "@wq2/miniblox-sdk";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import { Subscribe } from "@/event/Bus";

export default class FilterBypass extends Mod {
	public name = "FilterBypass";
	category = Category.UTILITY;

	@Subscribe("sendPacket")
	public editMessage(pkt: CancelableWrapper<C2SPacket>) {
		if ("text" in pkt.data && !pkt.data.text.startsWith("/")) {
			// https://unicode-explorer.com/c/202E
			pkt.data.text = `\u{202E}${pkt.data.text.split("").reverse().join("")}`;
		}
	}
}
