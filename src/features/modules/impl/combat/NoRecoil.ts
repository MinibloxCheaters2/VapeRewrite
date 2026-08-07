import type { S2CPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import { isS2C } from "@/utils";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class NoRecoil extends Mod {
	public name = "NoRecoil";
	public category = Category.COMBAT;

	@Subscribe("receivePacket")
	private onPacket(wrap: CancelableWrapper<S2CPacket>) {
		if (isS2C("CPacketApplyRecoil", wrap.data)) {
			console.log("cancelled");
			wrap.cancel();
		}
	}
}
