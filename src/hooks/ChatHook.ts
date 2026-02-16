/**
 * Hooks chat to add per-message IDs, and to provide editing messages after they're sent.
 * @module
 */

import type { Chat, ChatData, ChatLog } from "@/features/sdk/types/chat";
import Refs from "@/utils/refs";

const idSymbol = Symbol();

export type UUIDv4 = `${string}-${string}-4${string}-${string}-${string}`;

export default new (class ChatHook {
	origAddChat: Chat["addChat"];
	init() {
		const { chat } = Refs;
		this.origAddChat = chat.addChat;
		chat.addChat = new Proxy(chat.addChat, {
			apply(orig, ts, args: [ChatData]) {
				const modifiedArgs = args;
				modifiedArgs[0][idSymbol] = crypto.randomUUID() as UUIDv4;
				return Reflect.apply(orig, ts, args);
			},
			get(orig) {
				return orig;
			},
		});
	}
	modifyChat(
		id: UUIDv4,
		modifier: ChatLog | ((old: ChatLog) => ChatLog),
	): boolean {
		const { log } = Refs.chat;
		const origIdx = log.findIndex((log) => log[idSymbol] === id);
		if (origIdx === -1) return false;
		const orig = log[origIdx];
		const modified =
			typeof modifier === "function" ? modifier(orig) : modifier;
		log[origIdx] = modified;
		return true;
	}
	modifyChatAppend(
		id: UUIDv4,
		modifier: ChatLog | ((old: ChatLog) => ChatLog),
	): boolean {
		const { log } = Refs.chat;
		const origIdx = log.findIndex((log) => log[idSymbol] === id);
		if (origIdx === -1) return false;
		const orig = log[origIdx];
		const modified =
			typeof modifier === "function" ? modifier(orig) : modifier;
		delete log[origIdx];
		log.push(modified);
		return true;
	}
})();
