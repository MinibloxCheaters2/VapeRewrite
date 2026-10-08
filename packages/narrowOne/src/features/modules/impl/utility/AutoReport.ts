import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Bus from "@/Bus";
import canAttack from "@/utils/combat/teams";
import Refs from "@/utils/refs/game";

const STATIC_REPORTS: [number, number][] = [
	[2, 1],
	[3, 1],
	[4, 1],
	[4, 3],
	[5, 1]
];

export default class AutoReport extends Mod {
	name = "AutoReport";
	category = Category.UTILITY;

	valueSetting = this.createSliderSetting("Value", 100, 0, 99e9);

	@Bus.Subscribe("playerTick")
	private onTick() {
		const { players, instance, player } = Refs;
		// network is undefined in the case of us not having `main`.
		// game can't be undefined, since well...
		// our hook runs when the player loop is called.
		// idk why I'm checking if players is null because it shouldn't.
		if (!instance || !player) return;
		const selfTeam = player.teamId;
		for (const oPlr of players.values()) {
			// const {rigidBody} = oPlr;
			if (oPlr === player || oPlr.dead || !canAttack(selfTeam, oPlr.teamId)) continue;
			instance.antiCheat.reportPlayer(
				oPlr.id,
				1, // fly is the only one with a special severity number thing
				this.valueSetting.value()
			);
			for (const [reason, extra] of STATIC_REPORTS) {
				instance.antiCheat.reportPlayer(
					oPlr.id,
					reason,
					extra
				);
			}
		}
	}
}
