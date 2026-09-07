import Bus from "@/Bus";
import { lookAtPlayer } from "@/utils/aiming/lookAt";
import RotationManager, { RotationPlan } from "@/utils/aiming/rotate";
import game from "@/utils/refs/game";
import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

export default class KillAura extends Mod {
	name = "KillAura";
	category = Category.BLATANT;

	@Bus.Subscribe("playerTick")
	private onTick() {
		const {players, player, network} = game;
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
			// TODO: requires rotations
			const look = lookAtPlayer(
				oPlr.pos,
				player.pos
			);
			RotationManager.scheduleRotation(new RotationPlan(look, 5));
			player.addMeleeHitFlash();
			network.sendMeleeHitPlayer(
				oPlr.id,
				oPlr.currentSpawnId,
				player.id // myId
			);
		}
	}
}
