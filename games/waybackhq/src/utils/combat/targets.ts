import { type EntityLivingBase as ELB } from "@wq2/waybackhq-types/src/entity/entityliving";

import Refs from "@/hooks/game";

import { mod as cplr } from "../wrappers/clientplayer";
import { mod as elM } from "../wrappers/entityliving";
import canPlayerSeeEntity from "./wallCheck";

export function findTargets(range = 6, _angle = 360, checkWalls = false): ELB[] {
	const { localPlayer: player, world } = Refs.game;
	if (player === null) throw new Error("findTargets called while player is null");
	if (world === null) throw new Error("findTargets called while world is null");

	const sqRange = range * range;
	const { entities } = world;
	const { ClientPlayer } = cplr;
	const { EntityLivingBase } = elM;

	const targets = entities.filter((e) => {
		if (!(e instanceof EntityLivingBase) || !e.isEntityAlive()) return false;
		const base = !(e instanceof ClientPlayer) || !e.isLocal;
		if (!base) return false;
		const distance = player.getDistanceSqToEntity(e);
		// const d = Math.sqrt(distance);
		// debugging max attack distance
		// if (d > 3 && d < range) {
		// 	Refs.game.chat.receive(`[Vape Rewrite] dist = ${d}`);
		// }
		const distCheck = distance < sqRange;
		if (!distCheck) return false;
		const wallCheck = checkWalls && !canPlayerSeeEntity(e);
		if (wallCheck) return false;
		return true;
	});

	return targets as ELB[];
}
