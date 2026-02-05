import { argument, literal } from "@wq2/brigadier-ts";
import Bus from "@/Bus";
import type { EntityPlayer } from "@/features/sdk/types/entity";
import type { S2CPacket } from "@/features/sdk/types/packetTypes";
import ChatHook from "@/hooks/ChatHook";
import Refs from "@/utils/refs";
import PlayerArgumentType from "../api/brigadier/PlayerArgumentType";
import dispatcher from "../api/CommandDispatcher";
import { Subscribe } from "@/event/api/Bus";
import PacketRefs from "@/utils/packetRefs";
import type CancelableWrapper from "@/event/api/CancelableWrapper";

const POSITION_REGEX =
	/Pos: ([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?\s,([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?\s,\s([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?/i;

const parseCoord = (base: string, exp?: string) =>
	Number(exp ? `${base}e${exp}` : base);

let activeLocator: LocatorSession | undefined;

dispatcher.register(
	literal("locate").then(
		argument("player", new PlayerArgumentType()).executes(async (e) => {
			const player = e.get<EntityPlayer>("player");
			activeLocator?.stop();
			activeLocator = new LocatorSession(player);
			Refs.ClientSocket.sendPacket(
				new (PacketRefs.getRef("SPacketMessage"))({
					text: `/locate ${player.name}`,
				}),
			);
			return 1;
		}),
	),
);

class LocatorSession {
	private firstTime = true;
	private chatId?: ReturnType<typeof ChatHook.addChatWithId>;

	constructor(private readonly player: EntityPlayer) {
		Bus.registerSubscriber(this);
	}

	stop() {
		Bus.unregisterSubscriber(this);
	}

	@Subscribe("receivePacket")
	private onRecvPacket({ data: packet }: CancelableWrapper<S2CPacket>) {
		if (
			!(packet instanceof PacketRefs.getRef("CPacketMessage")) ||
			!packet.text.startsWith("Username:") ||
			!packet.text.includes(this.player.name)
		) {
			return;
		}

		const match = POSITION_REGEX.exec(packet.text);
		if (!match) return;

		const x = parseCoord(match[1], match[2]);
		const y = parseCoord(match[3], match[4]);
		const z = parseCoord(match[5], match[6]);
		const text = `[Locator] ${this.player.name} is at ${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}`;

		if (this.firstTime || !this.chatId) {
			this.chatId = ChatHook.addChatWithId({ text, color: "green" });
			this.firstTime = !!this.chatId;
			return;
		}

		ChatHook.modifyChat(this.chatId, { text, color: "green" });
	}
}
