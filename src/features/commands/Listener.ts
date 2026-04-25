/**
 * Intercepts chat message packets & auto-complete request packets to handle commands
 * @module
 */

import Bus from "@/Bus";
import { COMMAND_PREFIX } from "@/Client";
import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import Refs from "@/utils/helpers/refs";
import logger from "@/utils/logging/loggers";
import { c2s, s2c } from "@/utils/network/packetRefs";
import dispatcher from "./api/CommandDispatcher";

export default new (class CommandListener {
	constructor() {
		Bus.registerSubscriber(this);
	}

	static isCommand(msg: string): boolean {
		return (
			msg.startsWith(COMMAND_PREFIX) &&
			!msg.startsWith(COMMAND_PREFIX.repeat(2))
		);
	}

	@Subscribe("sendPacket")
	async intercept(wrap: CancelableWrapper<C2SPacket>) {
		const { data: packet } = wrap;
		if (
			packet instanceof c2s("SPacketMessage") &&
			CommandListener.isCommand(packet.text)
		) {
			wrap.cancel();
			const removedPrefix = packet.text.slice(COMMAND_PREFIX.length);
			const r = await dispatcher.parse(removedPrefix, null);
			if (r.getErrors().size > 0) {
				Refs.chat.addChat({
					text: `ERROR WHEN PARSING "${removedPrefix}": ${Array.from(r.getErrors().values()).join()}`,
					color: "red",
				});
				return;
			}
			try {
				await dispatcher.execute(r, null);
			} catch (e) {
				Refs.chat.addChat({
					text: `ERROR WHEN EXECUTING "${removedPrefix}": ${e} (this may exclude some useful information, check developer console for more info)`,
					color: "red",
				});
				logger.error(
					`ERROR WHEN EXECUTING COMMAND "${removedPrefix}":`,
					e,
				);
			}
		}
		if (
			packet instanceof c2s("SPacketTabComplete") &&
			CommandListener.isCommand(packet.message)
		) {
			wrap.cancel();
			const removedPrefix = packet.message.slice(COMMAND_PREFIX.length);
			const r = await dispatcher.parse(removedPrefix, null);
			const suggestions = await dispatcher.getCompletionSuggestions(r);
			const applied = suggestions.getList().map((s) => {
				const words = removedPrefix.split(" ");

				const suggestionText = s.getText();

				return words.length <= 1
					? `${COMMAND_PREFIX}${suggestionText}`
					: suggestionText;
			});
			Refs.chat.autoCompleteReceived(
				new (s2c("CPacketTabComplete"))({
					matches: applied,
				}),
			);
		}
	}
})();
