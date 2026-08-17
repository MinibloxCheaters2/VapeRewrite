import { Subscribe } from "@wq2/event-bus";
import type { AnyPacket, C2SPacket, S2CPacket } from "@wq2/miniblox-sdk";
import type CancelableWrapper from "@/event/CancelableWrapper";
import { isC2S, isS2C } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import { S2CData } from "@/event/Events";

class Log<T extends AnyPacket> {
	constructor(
		public packet: T,
		public timestamp: number,
	) {}
}

function isPacketBlacklisted(packet: AnyPacket): boolean {
	return (
		isS2C("CPacketChunkData", packet) ||
		isC2S("SPacketPing", packet) ||
		isS2C("CPacketPong", packet)
	);
}

/**
 * Logs all C2S and S2C packets and copies the log when you toggle off the module.
 */
export default class PacketLogger extends Mod {
	name = "PacketLogger";
	category = Category.UTILITY;
	#c2s: Log<C2SPacket>[] = [];
	#s2c: Log<S2CPacket>[] = [];

	@Subscribe("sendPacket")
	private onSendPacket(e: CancelableWrapper<C2SPacket>) {
		if (!Miniblox.game.inGame) return; // useless
		if (isPacketBlacklisted(e.data)) return;
		console.info("C -> S:", e.data);
		this.#c2s.push(new Log(e.data, Date.now()));
	}

	@Subscribe("receivePacket")
	private onReceivePacket(e: CancelableWrapper<S2CData>) {
		if (!Miniblox.game.inGame) return; // useless
		if (isPacketBlacklisted(e.data)) return;
		console.info("S -> C:", e.data);
		this.#s2c.push(new Log(e.data, Date.now()));
	}

	onDisable() {
		const data = JSON.stringify({ c2s: this.#c2s, s2c: this.#s2c });
		console.log(data);
		navigator.clipboard.writeText(data);
		Miniblox.game.chat.addChat({
			text: "Copied log to clipboard",
			color: "green",
		});
	}
}
