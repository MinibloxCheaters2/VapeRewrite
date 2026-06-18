import { Subscribe } from "@wq2/event-bus";
import type { S2CPacket } from "@wq2/miniblox-sdk";
import type CancelableWrapper from "@/event/CancelableWrapper";
import { s2c } from "@/utils";
import Refs from "@/utils/helpers/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class AutoRejoin extends Mod {
	name = "AutoRejoin";
	category = Category.UTILITY;
	@Subscribe("receivePacket")
	private lol({ data: pkt }: CancelableWrapper<S2CPacket>) {
		if (pkt instanceof s2c("CPacketDisconnect")) {
			Refs.game.connect(Refs.game.serverInfo.serverId);
		}
	}
}
