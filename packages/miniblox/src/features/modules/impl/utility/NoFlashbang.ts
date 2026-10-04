import type CancelableWrapper from "@vape/core/event/CancelableWrapper";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import { Subscribe } from "@/event/Bus";
import { S2CData } from "@/event/Events";
import { isS2C } from "@/utils";

export default class NoFlash extends Mod {
	name = "NoFlash";
	category = Category.UTILITY;

	@Subscribe("receivePacket")
	private onReceivePacket(wrap: CancelableWrapper<S2CData>) {
		if (isS2C("CPacketScreenFlash", wrap.data)) {
			wrap.cancel();
		}
	}
}
