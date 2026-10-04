import { CancelableWrapper } from "@vape/core/index";
import createProxy from "@vape/core/utils/helpers/proxy";
import { Entity } from "@wq2/waybackhq-types/src/entity/entity";
import { EntityLivingBase } from "@wq2/waybackhq-types/src/entity/entityliving";
import { DecodedVelocity, Session } from "@wq2/waybackhq-types/src/net/session";

import Bus from "@/Bus";
import { mod } from "@/utils/wrappers/entityliving";
import { ready, session } from "@/utils/wrappers/session";

import Refs from "./game";

let origApplyVelocity: Session["applyVelocity"];
let origKnockBack: EntityLivingBase["knockBack"];

export default function hook() {
	origApplyVelocity = session.prototype.applyVelocity;
	origKnockBack = mod.EntityLivingBase.prototype.knockBack;
	session.prototype.applyVelocity = createProxy(origApplyVelocity, {
		apply(target, thisArg: Session, argArray: [velocity: DecodedVelocity]) {
			const [vel] = argArray;
			const { x, y, z, id } = vel;
			const v = new CancelableWrapper({
				x,
				y,
				z,
				entityID: id,
			});
			Bus.emit("velocity", v);
			if (v.canceled) return;
			[vel.x, vel.y, vel.z] = [v.data.x, v.data.y, v.data.z];
			return Reflect.apply(target, thisArg, argArray);
		},
	});
	mod.EntityLivingBase.prototype.knockBack = createProxy(origKnockBack, {
		apply(
			target,
			thisArg: EntityLivingBase,
			argArray: [Entity, dmg: number, x: number, z: number],
		) {
			if (thisArg.entityId !== Refs.player?.entityId)
				return Reflect.apply(target, thisArg, argArray);
			const [, , dx, dz] = argArray;
			const v = new CancelableWrapper({
				x: dx,
				y: /*thisArg.world.knockback.vertical || */0.36,
				z: dz,
				entityID: thisArg.entityId,
			});
			Bus.emit("velocity", v);
			if (v.canceled) return;
			argArray[2] = v.data.x;
			argArray[3] = v.data.z;
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}
ready.then(hook);
