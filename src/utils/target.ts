import type { Entity, EntityPlayer } from "../features/sdk/types/entity.d.js";
import { MATCHED_DUMPS } from "../hooks/replacement";
import Refs from "./refs";

export function getTeam(entity: Entity) {
	const entry = Refs.game.playerList.playerDataMap.get(entity.id);
	if (!entry) return;
	return entry.color != "white" ? entry.color : undefined;
}

export function findTargets(range = 6, angle = 360, checkWalls = false) {
	const { game, player, EntityPlayer } = Refs;
	const localPos = game.player.pos.clone();
	const localTeam = getTeam(player);
	const entities = game.world[MATCHED_DUMPS.entities as "entities"];

	const sqRange = range * range;
	const entities2 = Array.from(entities.values());

	const targets = entities2.filter(e => {
		const base = e instanceof EntityPlayer && e.id != player.id;
		if (!base) return false;
		const distCheck = player.getDistanceSqToEntity(e) < sqRange;
		if (!distCheck) return false;
		// const isFriend = friends.includes(e.name);
		// const friendCheck = !ignoreFriends && isFriend;
		// if (friendCheck) return false;
		// pasted
		const {mode} = e;
		if (mode.isSpectator() || mode.isCreative()) return false;
		// const invisCheck = killAuraAttackInvisible[1] || e.isInvisibleDump();
		// if (!invisCheck) return false;
		const teamCheck = localTeam && localTeam == getTeam(e);
		if (teamCheck) return false;
		const wallCheck = checkWalls && !player.canEntityBeSeen(e);
		if (wallCheck) return false;
		return true;
	})

	return targets;
}
