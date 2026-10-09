import { Category, Mod } from "@vape/core/index";
import { Vector3 } from "three";

import Bus from "@/Bus";
import { hook, unhook } from "@/hooks/bowHook";
import { solveNarrowAim, bowSpeed, bowStrength, hasClearShot } from "@/utils/aiming/projectileAim";
import canAttack from "@/utils/combat/teams";
import gameRefs from "@/utils/refs/game";
import { main } from "@/hooks/mainHook";

export class AutoBow extends Mod {
	name = "AutoBow";
	category = Category.BLATANT;
	#target: Vector3 | null = null;

	protected onEnable(): void {
		hook();
	}

	protected onDisable(): void {
		unhook();
	}

	@Bus.Subscribe("shootDirection")
	private onShoot(dir: Vector3) {
		const aim = this.#target;
		if (!aim) return;
		dir.copy(aim);
		this.#target = null;
	}

	@Bus.Subscribe("gameTick")
	private onTick() {
		const { player: me } = gameRefs;
		if (!me || me.dead) return;
		const bow = me.bowWeapon;
		if (!bow) return;
		const cd = (
			bow.getFireCooldownActive ??
			bow.getFireUpCooldownActive ??
			bow.getCooldownActive
		)?.call(bow);
		if (cd) return;

		const target = this.findShot(me)?.direction;
		if (!target) return;
		this.#target = target;
		const mNow = main?.now ?? bow.lastFireTime + 10;
		if ("lastFireTime" in bow) bow.lastFireTime = mNow;
		else if ("lastFireUp" in bow) bow.lastFireUp = mNow;
		bow.shootArrow(10);
	}

	private findShot(me: any) {
		const victim = this.findNearest();
		if (!victim) return null;

		const origin = me.getCamPos();
		const target = victim.getCamPos();
		let vel = victim.predictedServerVelocity;
		if (!vel || vel.lengthSq() < 1e-6) vel = victim.rigidBody.velocity;
		if (!vel) return null;

		const strength = bowStrength(me);
		const vx = bowSpeed(me, strength);
		const aim = solveNarrowAim(origin, target, vel, vx, strength);
		if (!aim) return null;
		if (!hasClearShot(origin, target.clone().addScaledVector(vel, aim.time))) return null;
		return aim;
	}

	private findNearest(): any {
		const { players, player } = gameRefs;
		if (!players || !player) return null;
		let best: any = null,
			bestDist = Infinity;
		for (const p of players.values()) {
			if (p === player || p.dead || !p.hasValidPosition) continue;
			if (!canAttack(player.teamId, p.teamId)) continue;
			const d = player.pos.distanceTo(p.pos);
			if (d < bestDist) {
				bestDist = d;
				best = p;
			}
		}
		return best;
	}
}
