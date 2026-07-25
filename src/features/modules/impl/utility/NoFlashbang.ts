import type { S2CPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import { isS2C } from "@/utils";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class NoFlash extends Mod {
	name = "NoFlash";
	category = Category.UTILITY;

	@Subscribe("receivePacket")
	private onReceivePacket(wrap: CancelableWrapper<S2CPacket>) {
		if (isS2C("CPacketScreenFlash", wrap.data)) {
			wrap.cancel();
		}
	}
}
