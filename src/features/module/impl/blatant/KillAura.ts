import { Subscribe } from "../../../../event/api/Bus";
import { MATCHED_DUMPS } from "../../../../hooks/replacement";
import PacketRefs from "../../../../utils/packetRefs";
import Refs from "../../../../utils/refs";
import { findTargets } from "../../../../utils/target";
import { Entity } from "../../../sdk/types/entity";
import Category from "../../api/Category";
import Mod from "../../api/Module";

// TODO: don't hardcode these when we add settings
const RANGE = 6;
const AUTO_BLOCK = true;

function wrapAngleTo180_radians(j: number): number {
  j = j % (Math.PI * 2);
  if (j >= Math.PI) {
    j -= Math.PI * 2;
  }
  if (j < -Math.PI) {
    j += Math.PI * 2;
  }
  return j;
}

export default class KillAura extends Mod {
	public name = "KillAura";
	public category = Category.BLATANT;
	private attackDelay = Date.now();
	private blocking = false;

	block() {
		if (AUTO_BLOCK) {
			if (!this.blocking) {
				const {ClientSocket, playerControllerMP} = Refs;
				const d = MATCHED_DUMPS.syncItem as "syncItem";
				playerControllerMP[d]();
				ClientSocket.sendPacket(new (PacketRefs.getRef("SPacketUseItem")));
				this.blocking = true;
			}
		} else this.blocking = false;
	}

	unblock() {
		if (this.blocking) {
			const {ClientSocket, BlockPos, EnumFacing, playerControllerMP} = Refs;
			const d = MATCHED_DUMPS.syncItem as "syncItem";
			playerControllerMP[d]();
			ClientSocket.sendPacket(new (PacketRefs.getRef("SPacketPlayerAction"))({
				position: BlockPos.ORIGIN.toProto(),
				facing: EnumFacing.DOWN.getIndex(),
				action: 5 // PBAction,RELEASE_USE_ITEM
			}));
			this.blocking = false;
		}
	}

	sendAttack(e: Entity) {
		const {ClientSocket, PBVector3, player} = Refs;
		const box = e.getEntityBoundingBox();
		const hitVec = player.getEyePos().clone().clamp(box.min, box.max);
		ClientSocket.sendPacket(new (PacketRefs.getRef("SPacketUseEntity"))({
			id: e.id,
			action: 1,
			hitVec: new PBVector3({
				x: hitVec.x,
				y: hitVec.y,
				z: hitVec.z
			})
		}));
	}

	@Subscribe("tick")
	onTick() {
		for (const target of findTargets()) {
			this.block();
			this.sendAttack(target);
			this.unblock();
		}
	}
}
