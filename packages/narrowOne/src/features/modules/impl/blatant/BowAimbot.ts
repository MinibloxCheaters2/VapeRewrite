import { Category, Mod } from "@vape/core/index";

import Bus from "@/Bus";
import { main } from "@/hooks/mainHook";
import { solveNarrowAim, bowSpeed, bowStrength } from "@/utils/aiming/projectileAim";
import game from "@/utils/refs/game";

export class BowAimbot extends Mod {
	name = "BowAimbot";
	category = Category.BLATANT;
	constructor() {
		super();
	}

	@Bus.Subscribe("gameTick")
	private onTick() {
		const { player: me } = game;
		if (!main) return;
		if (!me || !me.game || me.game.gameEnded) return;
		// TODO: the game devs don't check if you're holding a melee weapon,
		// they probably don't check here for holding a bow either.
		if (!me.bowWeapon) return;

		const victim = this.findNearest();
		if (!victim) return;

		const origin = me.getCamPos();
		const target = victim.getCamPos();

		let vel = victim.predictedServerVelocity;
		if (!vel || vel.lengthSq() < 1e-6) vel = victim.rigidBody.velocity;

		const strength = bowStrength(me);
		const vx = bowSpeed(me, strength);

		const aim = solveNarrowAim(origin, target, vel, vx, strength);
		if (!aim) return;

		me.lookRot.x = aim.yaw;
		me.lookRot.y = aim.pitch;
		me.inputManager.lookInput.set(0, 0);
		if (me.smoothCam) me.smoothLookRotTarget.copy(me.lookRot);
		me.cachedCamRotDirty = true;
	}

	private findNearest(): any {
		const { players, player } = game;
		if (!players) return;
		let best: any = null;
		let bestDist = Infinity;
		const myPos = player.pos;
		for (const p of players.values()) {
			if (p === player || p.dead || p.teamId === player.teamId) continue;
			if (!p.hasValidPosition) continue;
			const d = myPos.distanceTo(p.pos);
			if (d < bestDist) {
				bestDist = d;
				best = p;
			}
		}
		return best;
	}
}
