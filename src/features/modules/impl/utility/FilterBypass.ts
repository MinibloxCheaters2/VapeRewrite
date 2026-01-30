import { Subscribe } from "@/event/api/Bus";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import CancelableWrapper from "@/event/api/CancelableWrapper";
import { C2SPacket } from "@/features/sdk/types/packetTypes";

export default class FilterBypass extends Mod {
	public name = "FilterBypass";
	category = Category.UTILITY;

	@Subscribe("sendPacket")
	public editMessage(pkt: CancelableWrapper<C2SPacket>) {
		if ("text" in pkt.data && !pkt.data.text.startsWith("/")) {
			// "(www.roblox.com) <message here>" filter bypass method ahh
			// (yes, that is for Roblox, it apparently was a private method, and I don't know if it got patched.)
			pkt.data.text = pkt.data.text
				.split(" ")
				.map((w) => `${w.charAt(0)}\\${w.slice(1)}`)
				.join(" ");
		}
	}
}
