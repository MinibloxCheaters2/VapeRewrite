import type { C2SPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import Category from "../../api/Category";
import Mod from "../../api/Module";

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
