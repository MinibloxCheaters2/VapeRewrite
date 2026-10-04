import type CancelableWrapper from "@vape/core/event/CancelableWrapper";
import type { C2SPacket } from "@wq2/miniblox-sdk";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import { Subscribe } from "@/event/Bus";
import { isS2C } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";

// when you send a 50 character message, the server seems to trigger the mute detection.
const LIMIT = 50;

export default class RejoinOnMute extends Mod {
	public name = "RejoinOnMute";
	public category = Category.UTILITY;

	@Subscribe("receivePacket")
	private onRecvPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (
			isS2C("CPacketMessage", packet) &&
			packet.color === undefined &&
			packet.id === undefined &&
			packet.text.startsWith(`${Miniblox.player.name}: `) &&
			packet.text.length < LIMIT
		) {
			Miniblox.chat.addChat({
				text: "[RejoinOnMute] You have been muted by a game moderator, rejoining!",
				color: "yellow",
			});
			Miniblox.game.connect(Miniblox.game.serverInfo.serverId);
		}
	}
}
