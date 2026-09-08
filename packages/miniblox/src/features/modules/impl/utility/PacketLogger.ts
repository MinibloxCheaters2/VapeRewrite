import type CancelableWrapper from "@vape/core/event/CancelableWrapper";
import type { AnyPacket, C2SPacket, S2CPacket } from "@wq2/miniblox-sdk";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import { Subscribe } from "@/event/Bus";
import { S2CData } from "@/event/Events";
import { isC2S, isS2C } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";

class Log {
	constructor(
		public packet: C2SPacket | S2CData,
		public timestamp: number,
	) {}
}

function isPacketBlacklisted(packet: C2SPacket | S2CData): boolean {
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
	#c2s: Log[] = [];
	#s2c: Log[] = [];

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
