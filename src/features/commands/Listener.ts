/**
 * Intercepts chat message packets & auto-complete request packets to handle commands
 * @module
 */

import Bus from "@/Bus";
import { COMMAND_PREFIX } from "@/Client";
import { Subscribe } from "@/event/api/Bus";
import CancelableWrapper from "@/event/api/CancelableWrapper";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import { C2SPacket } from "@/features/sdk/types/packetTypes";
import dispatcher from "./api/CommandDispatcher";
import logger from "@/utils/loggers";

export default new class CommandListener {
	constructor() {
		Bus.registerSubscriber(this);
	}

	static isCommand(msg: string): boolean {
		return msg.startsWith(COMMAND_PREFIX) && !msg.startsWith(COMMAND_PREFIX.repeat(2))
	}

	@Subscribe("sendPacket")
	async intercept(wrap: CancelableWrapper<C2SPacket>) {
		const { data: packet } = wrap;
		if (packet instanceof PacketRefs.getRef("SPacketMessage") && CommandListener.isCommand(packet.text)) {
			wrap.cancel();
			const removedPrefix = packet.text.slice(COMMAND_PREFIX.length);
			const r = await dispatcher.parse(removedPrefix, null);
			if (r.getErrors().size > 0) {
				Refs.game.chat.addChat({
					text: `ERROR WHEN PARSING "${removedPrefix}": ${Array.from(r.getErrors().values()).join()}`
				});
				return;
			}
			try {
				await dispatcher.execute(r, null);
			} catch (e) {
				Refs.game.chat.addChat({
					text: `ERROR WHEN EXECUTING "${removedPrefix}": ${e} (this may exclude some useful information, check developer console for more info)`
				});
				logger.error(`ERROR WHEN EXECUTING COMMAND "${removedPrefix}":`, e);
			}
		}
		if (packet instanceof PacketRefs.getRef("SPacketTabComplete") && CommandListener.isCommand(packet.message)) {
			wrap.cancel();
			const removedPrefix = packet.message.slice(COMMAND_PREFIX.length);
    		const r = await dispatcher.parse(removedPrefix, null);
			const suggestions = await dispatcher.getCompletionSuggestions(r);
			const applied = suggestions.getList().map(s => {
				const words = removedPrefix.split(" ");
				const last = words[words.length - 1];
				const applied = s.apply(last);
				return words.length <= 1 ? `${COMMAND_PREFIX}${applied}` : applied;
			});
			Refs.game.chat.autoCompleteReceived(new (PacketRefs.getRef("CPacketTabComplete"))({
				matches: applied
			}));
		}
	}
};
