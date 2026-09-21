/**
 * Intercepts chat message packets & auto-complete request packets to handle commands
 * @module
 */

import type { CancelableWrapper } from "@/event/Bus";
import type { C2SPacket } from "@wq2/miniblox-sdk";

import { COMMAND_PREFIX } from "@vape/core/Client";
import dispatcher from "@vape/core/features/commands/api/CommandDispatcher";
import logger from "@vape/core/utils/logging/loggers";

import Bus from "@/Bus";
import { Priority, Subscribe } from "@/event/Bus";
import { isC2S } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";

export default new (class CommandListener {
	constructor() {
		Bus.registerSubscriber(this);
	}

	static isCommand(msg: string): boolean {
		return msg.startsWith(COMMAND_PREFIX) && !msg.startsWith(COMMAND_PREFIX.repeat(2));
	}

	@Subscribe("sendPacket", Priority.HIGHEST)
	async intercept(wrap: CancelableWrapper<C2SPacket>) {
		const { data: packet } = wrap;
		if (isC2S("SPacketMessage", packet) && CommandListener.isCommand(packet.text)) {
			wrap.cancel();
			const removedPrefix = packet.text.slice(COMMAND_PREFIX.length);
			const r = await dispatcher.parse(removedPrefix, null);
			if (r.getErrors().size > 0) {
				Miniblox.chat.addChat({
					text: `ERROR WHEN PARSING "${removedPrefix}": ${Array.from(r.getErrors().values()).join()}`,
					color: "red",
				});
				return;
			}
			try {
				await dispatcher.execute(r, null);
			} catch (e) {
				Miniblox.chat.addChat({
					text: `ERROR WHEN EXECUTING "${removedPrefix}": ${e} (this may exclude some useful information, check developer console for more info)`,
					color: "red",
				});
				logger.error(`ERROR WHEN EXECUTING COMMAND "${removedPrefix}":`, e);
			}
		}
		if (isC2S("SPacketTabComplete", packet) && CommandListener.isCommand(packet.message)) {
			wrap.cancel();
			const removedPrefix = packet.message.slice(COMMAND_PREFIX.length);
			const r = await dispatcher.parse(removedPrefix, null);
			const suggestions = await dispatcher.getCompletionSuggestions(r);
			const applied = suggestions.getList().map((s) => {
				const words = removedPrefix.split(" ");

				const suggestionText = s.getText();

				return words.length <= 1 ? `${COMMAND_PREFIX}${suggestionText}` : suggestionText;
			});
			Miniblox.chat.autoCompleteReceived({ matches: applied });
		}
	}
})();
