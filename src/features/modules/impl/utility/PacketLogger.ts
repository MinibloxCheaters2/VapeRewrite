import { Subscribe } from "@wq2/event-bus";
import type { AnyPacket, C2SPacket, S2CPacket } from "@wq2/miniblox-sdk";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import { c2s, s2c } from "@/utils";
import Refs from "@/utils/helpers/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

class Log<T extends AnyPacket> {
	constructor(
		public packet: T,
		public timestamp: number,
	) {}
}

function isPacketBlacklisted(packet: AnyPacket): boolean {
	return (
		packet instanceof s2c("CPacketChunkData") ||
		packet instanceof c2s("SPacketPing") ||
		packet instanceof s2c("CPacketPong")
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
		if (!Refs.game.inGame) return; // useless
		if (isPacketBlacklisted(e.data)) return;
		console.info("C -> S:", e.data);
		this.#c2s.push(new Log(e.data, Date.now()));
	}

	@Subscribe("receivePacket")
	private onReceivePacket(e: CancelableWrapper<S2CPacket>) {
		if (!Refs.game.inGame) return; // useless
		if (isPacketBlacklisted(e.data)) return;
		console.info("S -> C:", e.data);
		this.#s2c.push(new Log(e.data, Date.now()));
	}

	onDisable() {
		const data = JSON.stringify({ c2s: this.#c2s, s2c: this.#s2c });
		console.log(data);
		navigator.clipboard.writeText(data);
		Refs.game.chat.addChat({
			text: "Copied log to clipboard",
			color: "green",
		});
	}
}
