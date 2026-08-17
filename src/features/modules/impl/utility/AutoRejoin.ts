import { Subscribe } from "@wq2/event-bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import { isS2C } from "@/utils";
import { S2CData } from "@/event/Events";

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
