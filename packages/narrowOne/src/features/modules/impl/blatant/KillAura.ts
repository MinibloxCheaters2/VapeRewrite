import Bus from "@/Bus";
import Refs from "@/utils/Refs";
import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

export default class KillAura extends Mod {
	name = "KillAura";
	category = Category.BLATANT;

	@Bus.Subscribe("playerTick")
	private onTick() {
		const {players, network} = Refs;
		// network is undefined in the case of us not having `main`.
		// game can't be undefined, since well...
		// our hook runs when the player loop is called.
		// idk why I'm checking if players is null because it shouldn't.
		if (!network || !players) return;
		for (const player of Refs.players.values()) {
			network.sendMeleeHitPlayer(
				player.id
			);
		}
	}
}
