import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import { s2c } from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import { dynamicIsland } from "../../DynamicIsland";

// when you send a 50 character message, the server seems to trigger the mute detection.
const LIMIT = 50;

export default class RejoinOnMute extends Mod {
	public name = "RejoinOnMute";
	public category = Category.UTILITY;

	@Subscribe("receivePacket")
	private onRecvPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (
			packet instanceof s2c("CPacketMessage") &&
			packet.color === undefined &&
			packet.id === undefined &&
			packet.text.startsWith(`${Refs.player.name}: `) &&
			packet.text.length < LIMIT
		) {
			Refs.chat.addChat({
				text: "[RejoinOnMute] You have been muted by a game moderator, rejoining!",
				color: "yellow",
			});

			// Show Dynamic Island notification
			try {
				console.log("RejoinOnMute showing DI");
				if (dynamicIsland) {
					dynamicIsland.show({
						duration: 2000,
						width: 260,
						height: 60,
						elements: [
							{
								type: "text",
								content: "RejoinOnMute",
								x: 0,
								y: -8,
								color: "#fff",
								size: 13,
								bold: true,
							},
							{
								type: "text",
								content: "Rejoining in 0.4s",
								x: 0,
								y: 12,
								color: "#888",
								size: 11,
							},
						],
					});
				}
			} catch (_e) {
				// Dynamic Island not available
			}

			Refs.game.connect(Refs.game.serverInfo.serverId);
		}
	}
}
