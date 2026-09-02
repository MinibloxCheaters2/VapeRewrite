import { type EntityLivingBase as ELB } from "@wq2/waybackhq-types/src/entity/entityliving";

import Refs from "@/hooks/game";

import { mod as cplr } from "../wrappers/clientplayer";
import { mod as elM } from "../wrappers/entityliving";
import canPlayerSeeEntity from "./wallCheck";

export function findTargets(range = 6, _angle = 360, checkWalls = false): ELB[] {
	const { localPlayer: player, world } = Refs.game;
	if (world === undefined) throw new Error("findTargets called while world is null");

	const sqRange = range * range;
	const { entities } = world;
	const { ClientPlayer } = cplr;
	const { EntityLivingBase } = elM;

	const targets = entities.filter((e) => {
		if (!(e instanceof EntityLivingBase) || !e.isEntityAlive()) return false;
		const base = !(e instanceof ClientPlayer) || !e.isLocal;
		if (!base) return false;
		const distCheck = player.getDistanceSqToEntity(e) < sqRange;
		if (!distCheck) return false;
		const wallCheck = checkWalls && !canPlayerSeeEntity(e);
		if (wallCheck) return false;
		return true;
	});

	return targets as ELB[];
}
