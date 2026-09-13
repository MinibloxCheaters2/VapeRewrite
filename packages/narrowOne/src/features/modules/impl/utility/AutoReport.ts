import Bus from "@/Bus";
import Refs from "@/utils/refs/game";
import Category from "@vape/core/features/modules/api/Category"
import Mod from "@vape/core/features/modules/api/Module"
import THREE from "@/utils/refs/three";

export default class AutoReport extends Mod {
	name = "AutoReport";
	category = Category.UTILITY;

	valueSetting = this.createSliderSetting("Value", 100, 0, 99e9);

	@Bus.Subscribe("playerTick")
	private onTick() {
		const {players, player, network, instance: game} = Refs;
		// network is undefined in the case of us not having `main`.
		// game can't be undefined, since well...
		// our hook runs when the player loop is called.
		// idk why I'm checking if players is null because it shouldn't.
		if (!network || !players || !player) return;
		const selfTeam = player.teamId;
		for (const oPlr of players.values()) {
			// const {rigidBody} = oPlr;
			if (oPlr === player || oPlr.dead) continue;
			if (oPlr.teamId === selfTeam) continue;
			player.pos.copy(oPlr.pos);
		}
	}
}
