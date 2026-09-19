import { Category, Mod } from "@vape/core/index";

import { solveNarrowAim, bowSpeed, bowStrength } from "@/utils/aiming/projectileAim";
import game from "@/utils/refs/game";
import { ready } from "@/hooks/gameHook";
import createProxy from "@vape/core/utils/helpers/proxy";
import type { Vector3 } from "three";
import canAttack from "@/utils/combat/teams";

let hooked: boolean, orig: () => Vector3;

export class BowAimbot extends Mod {
	name = "BowAimbot";
	category = Category.BLATANT;

	private readonly modeSetting = this.createDropdownSetting("Mode", ["Silent", "Camera"]);

	get mode() {
		return this.modeSetting.value();
	}

	protected onEnable(): void {
		ready.then(() => {
			hooked = true;
			orig = game.player.getShootDirection;
			game.player.getShootDirection = createProxy(orig, {
				apply: (target, thisArg, argArray: []) => {
					const aim = this.findTarget();
					return aim?.direction ?? Reflect.apply(target, thisArg, argArray);
				},
			});
		})
	}
	protected onDisable(): void {
		if (!hooked) return;
		game.player.getShootDirection = orig;
	}

	private findTarget() {
		const { player: me } = game;
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
		return aim;
	}

	private findNearest(): any {
		const { players, player } = game;
		if (!players) return;
		let best: any = null;
		let bestDist = Infinity;
		const myPos = player.pos;
		for (const p of players.values()) {
			if (p === player || p.dead || !canAttack(player.teamId, p.teamId)) continue;
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
