import type CancelableWrapper from "@vape/core/event/CancelableWrapper";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import { Subscribe } from "@/event/Bus";
import { S2CData } from "@/event/Events";
import { isS2C } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";

export default class AutoRejoin extends Mod {
	name = "AutoRejoin";
	category = Category.UTILITY;
	@Subscribe("receivePacket")
	private lol({ data: pkt }: CancelableWrapper<S2CData>) {
		if (isS2C("CPacketDisconnect", pkt)) {
			Miniblox.game.connect(Miniblox.game.serverInfo.serverId);
		}
	}
}
