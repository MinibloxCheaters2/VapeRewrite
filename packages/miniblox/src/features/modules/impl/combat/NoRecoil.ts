import type CancelableWrapper from "@vape/core/event/CancelableWrapper";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import { Subscribe } from "@/event/Bus";
import { S2CData } from "@/event/Events";
import { isS2C } from "@/utils";

export default class NoRecoil extends Mod {
	public name = "NoRecoil";
	public category = Category.COMBAT;

	@Subscribe("receivePacket")
	private onPacket(wrap: CancelableWrapper<S2CData>) {
		if (isS2C("CPacketApplyRecoil", wrap.data)) {
			console.log("cancelled");
			wrap.cancel();
		}
	}
}
