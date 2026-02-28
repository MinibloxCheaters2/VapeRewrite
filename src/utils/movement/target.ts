import type { Entity } from "../../features/sdk/types/entity.d.js";
import Refs from "../helpers/refs";

export function getTeam(entity: Entity) {
    const entry = Refs.game.playerList.playerDataMap.get(entity.id);
    if (!entry) return;
    return entry.color !== "white" ? entry.color : undefined;
}

export function findTargets(range = 6, _angle = 360, checkWalls = false) {
    const { player, EntityLivingBase, world } = Refs;
    const localTeam = getTeam(player);

    const sqRange = range * range;
    // auto remapping proxy!
    const entities = Array.from(world.entities.values());

    const targets = entities.filter((e) => {
        const base = e instanceof EntityLivingBase && e.id !== player.id;
        if (!base) return false;
        const distCheck = player.getDistanceSqToEntity(e) < sqRange;
        if (!distCheck) return false;
        const teamCheck = localTeam && localTeam === getTeam(e);
        if (teamCheck) return false;
        const wallCheck = checkWalls && !player.canEntityBeSeen(e);
        if (wallCheck) return false;
        return true;
    });

    return targets;
}
