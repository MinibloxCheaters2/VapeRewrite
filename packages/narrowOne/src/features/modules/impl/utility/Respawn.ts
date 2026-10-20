import gameRefs from "@/utils/refs/game";
import Category from "@vape/core/features/modules/api/Category"
import Mod from "@vape/core/features/modules/api/Module"
import { showNotification } from "@vape/ui-api";
import { Player } from "@wq2/narrow-one-types";

export default class Respawn extends Mod {
	name = "Respawn";
	category = Category.UTILITY;
	protected onEnable(): void {
		const {player, network} = gameRefs;
		if (!player) return showNotification("Respawn", "not in a game!", "warning", 0.5e3);
		if (!network) return showNotification("Respawn", "not unlocked yet", "warning", 0.5e3);
		player.sendPerformAction((player.constructor as unknown as typeof Player).PlayerAction.SPAWN);
		network.sendRequestRespawn(player.id);
	}
}