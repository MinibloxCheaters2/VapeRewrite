/**
 * Hooks chat to add per-message IDs, and to provide editing messages after they're sent.
 * @module
 */

import type { Chat, ChatData } from "@/features/sdk/types/chat";
import Refs from "@/utils/refs";

const idSymbol = Symbol();

export type UUIDv4 = `${string}-${string}-4${string}-${string}-${string}`;

export default new (class ChatHook {
	origAddChat: Chat["addChat"];
	constructor() {
		const { chat } = Refs.game;
		this.origAddChat = chat.addChat;
		chat.addChat = new Proxy(chat.addChat, {
			apply(orig, ts, args: [ChatData]) {
				const modifiedArgs = args;
				modifiedArgs[0][idSymbol] = crypto.randomUUID() as UUIDv4;
				orig.apply(ts, args);
			},
			get(orig) {
				return orig;
			},
		});
	}
})();
