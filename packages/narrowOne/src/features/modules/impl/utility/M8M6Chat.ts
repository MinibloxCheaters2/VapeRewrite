import Category from "@vape/core/src/features/modules/api/Category";
import Mod from "@vape/core/src/features/modules/api/Module";
import createProxy from "@vape/core/src/utils/helpers/proxy";

import gameRefs, { anyReady } from "@/utils/refs/game";
import { showNotification } from "@vape/ui-api";
import type { Chat } from "@wq2/narrow-one-types/src/game";

let origProto: Chat, origUpdateVisibility: () => void;

export default class M8M6Chat extends Mod {
	name = "M8M6Chat";
	category = Category.UTILITY;
	#setOrigValues() {
		if (origProto || origUpdateVisibility) return;
		const { onlineInstance: instance} = gameRefs;
		if (!instance) return showNotification("M8M6Chat", "not in game, can't hook", "alert", 0.5e3);
		const { chat } = instance;
		if (!origProto) origProto = Object.getPrototypeOf(chat);
		if (!origUpdateVisibility) origUpdateVisibility = origProto.updateVisibility;
	}
	protected onEnable(): void {
		anyReady.then(() => {
			this.#setOrigValues();
			origProto.updateVisibility = createProxy(origUpdateVisibility, {
				apply(_, thisArg: Chat, __) {
					const { network, settingsManager } = gameRefs;
					if (!network || !settingsManager) return Reflect.apply(_, thisArg, __);
					const visible = !thisArg.game.usedForCameraShotsOnly &&
						!!settingsManager.getValue("chatEnabled") &&
						!settingsManager.getValue("hideUi") &&
						(document.activeElement == thisArg.textBoxEl ||
							(!!thisArg.toggledVisible && network.squadManager.isInSquad));
					thisArg.visible = visible;
					thisArg.el.classList.toggle("hidden", !visible);
				},
			});
		});
	}
	protected onDisable(): void {
		if (!origProto || !origUpdateVisibility) return;
		origProto.updateVisibility = origUpdateVisibility;
	}
}
