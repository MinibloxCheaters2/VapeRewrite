import bus from "@/Bus";
import { ready, session } from "@/utils/wrappers/session";
import { mod, ready as elReady } from "@/utils/wrappers/entityliving";
import { DecodedVelocity, Session } from "@wq2/waybackhq-types/src/net/session";
import { CancelableWrapper } from "@vape/core/index";
import { EntityLivingBase } from "@wq2/waybackhq-types/src/entity/entityliving";
import { Entity } from "@wq2/waybackhq-types/src/entity/entity";
import Refs from "./game";

let origApplyVelocity: Session["applyVelocity"];
let origKnockBack: EntityLivingBase["knockBack"];

export default function hook() {
	origApplyVelocity = session.prototype.applyVelocity;
	origKnockBack = mod.EntityLivingBase.prototype.knockBack;
	session.prototype.applyVelocity = new Proxy(origApplyVelocity, {
		apply(target, thisArg: Session, argArray: [velocity: DecodedVelocity]) {
			const v = new CancelableWrapper(argArray[0]);
			bus.emit("velocity", v);
			if (v.canceled) return;
			argArray[0] = v.data;
			return Reflect.apply(target, thisArg, argArray);
		}
	});
	mod.EntityLivingBase.prototype.knockBack = new Proxy(origKnockBack, {
		apply(target, thisArg: EntityLivingBase, argArray: [Entity, dmg: number, x: number, z: number]) {
			if (thisArg.entityId !== Refs.player.entityId)
				return Reflect.apply(target, thisArg, argArray);
			const [,, dx, dz] = argArray;
			const v = new CancelableWrapper({
				x: dx,
				y: thisArg.world.knockback || 0.36,
				z: dz
			});
			bus.emit("velocity", v);
			if (v.canceled) return;
			argArray[2] = v.data.x;
			argArray[3] = v.data.z;
			return Reflect.apply(target, thisArg, argArray);
		}
	});
}
ready.then(hook);
