import type { C2SPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import Category from "../../api/Category";
import Mod from "../../api/Module";

/**
 * Bypasses the chat's (very basic) AntiSpam.
 * The AntiSpam detects whenever you're sending a message with the exact same contents.
 * We can use the `\` character, however,
 * which gets stripped out of the message before the AntiSpam code runs,
 * and now after the chat filtering runs (FilterBypass used to use `\`).
 */
export default class AntiSpamBypass extends Mod {
	public name = "AntiSpamBypass";
	category = Category.UTILITY;

	#lastMessageContents = undefined;
	#bypassed = false;

	@Subscribe("connect")
	private reset() {
		// the AntiSpam runs on the server and doesn't bother to check if you send a message,
		// rejoin, and then send it again.
		this.#lastMessageContents = undefined;
		this.#bypassed = false;
	}

	@Subscribe("sendPacket")
	private editMessage(pkt: CancelableWrapper<C2SPacket>) {
		if ("text" in pkt.data && !pkt.data.text.startsWith("/")) {
			const msg = pkt.data.text;
			this.#lastMessageContents = pkt.data.text;
			if (this.#lastMessageContents === msg) {
				pkt.data.text = `${msg}${this.#bypassed ? "" : "\\"}`;
				this.#bypassed = !this.#bypassed;
			}
		}
	}
}
