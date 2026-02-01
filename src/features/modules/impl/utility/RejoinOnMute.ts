import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

// when you send a 50 character message, the server seems to trigger the mute detection.
const LIMIT = 50;

export default class RejoinOnMute extends Mod {
	public name = "RejoinOnMute";
	public category = Category.UTILITY;

	@Subscribe("receivePacket")
	private onRecvPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (
			packet instanceof PacketRefs.getRef("CPacketMessage") &&
			packet.color === undefined &&
			packet.id === undefined &&
			packet.text.startsWith(`${Refs.game.player.name}: `) &&
			packet.text.length < LIMIT
		) {
			Refs.game.chat.addChat({
				text: "[RejoinOnMute] You have been muted by a game moderator, rejoining!",
				color: "yellow",
			});
			Refs.game.connect(Refs.game.serverInfo.serverId);
		}
	}
}
