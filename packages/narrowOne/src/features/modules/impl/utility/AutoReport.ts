import Bus from "@/Bus";
import game from "@/utils/refs/game";
import Category from "@vape/core/features/modules/api/Category"
import Mod from "@vape/core/features/modules/api/Module"

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
		const {players, player, instance: game} = game;
		if (!players || !game) return;
		for (const plr of players.values()) {
			if (plr === player) continue;
			game.antiCheat.reportPlayer(
				plr.id,
				1, // fly is the only one with a special severity number thing
				this.valueSetting.value()
			);
			for (const [reason, extra] of STATIC_REPORTS) {
				game.antiCheat.reportPlayer(
					plr.id,
					reason,
					extra
				);
			}
		}
	}
}
