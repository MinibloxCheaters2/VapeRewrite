import { Subscribe } from "@/event/api/Bus";
import type { Entity } from "@/features/sdk/types/entity";
import { MATCHED_DUMPS } from "@/hooks/replacement";
import RotationManager, { RotationPlan } from "@/utils/aiming/rotate";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import { findTargets } from "@/utils/target";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import Rotation from "@/utils/aiming/rotation";
import deg2rad from "@/utils/radians";

function wrapAngleTo180_radians(angle: number): number {
	let ang = angle;
	ang = ang % (Math.PI * 2);
	if (ang >= Math.PI) {
		ang -= Math.PI * 2;
	}
	if (ang < -Math.PI) {
		ang += Math.PI * 2;
	}
	return ang;
}

export default class KillAura extends Mod {
	public name = "KillAura";
	public category = Category.BLATANT;
	private attackDelay = Date.now();
	private blocking = false;

	// Settings
	private rangeSetting = this.createSliderSetting("Range", 6, 3, 10, 0.5);
	private angleSetting = this.createSliderSetting("Angle", 360, 1, 360, 1);
	private autoBlockSetting = this.createToggleSetting("Auto Block", true);

	get range() {
		return this.rangeSetting.value();
	}

	get angle() {
		return this.angleSetting.value();
	}

	get autoBlock() {
		return this.autoBlockSetting.value();
	}

	block() {
		if (this.autoBlock) {
			if (!this.blocking) {
				const { ClientSocket, playerControllerMP } = Refs;
				const d = MATCHED_DUMPS.syncItem as "syncItem";
				playerControllerMP[d]();
				ClientSocket.sendPacket(
					new (PacketRefs.getRef("SPacketUseItem"))(),
				);
				this.blocking = true;
			}
		} else this.blocking = false;
	}

	unblock() {
		if (this.blocking) {
			const { ClientSocket, BlockPos, EnumFacing, playerControllerMP } =
				Refs;
			const d = MATCHED_DUMPS.syncItem as "syncItem";
			playerControllerMP[d]();
			ClientSocket.sendPacket(
				new (PacketRefs.getRef("SPacketPlayerAction"))({
					position: BlockPos.ORIGIN.toProto(),
					facing: EnumFacing.DOWN.getIndex(),
					action: 5, // PBAction,RELEASE_USE_ITEM
				}),
			);
			this.blocking = false;
		}
	}

	sendAttack(e: Entity, first: boolean) {
		const { ClientSocket, PBVector3, player } = Refs;
		const box = e.getEntityBoundingBox();
		const hitVec = player.getEyePos().clone().clamp(box.min, box.max);

		const aimPos = player.pos.clone().sub(e.pos);
		const lastReportedYawN = MATCHED_DUMPS.lastReportedYaw as "lastReportedYaw";
		const newYaw = wrapAngleTo180_radians(
			Math.atan2(aimPos.x, aimPos.z) - player[lastReportedYawN],
		);
		const checkYaw = wrapAngleTo180_radians(
			Math.atan2(aimPos.x, aimPos.z) - player.yaw,
		);
		if (
			first &&
			Math.abs(checkYaw) > deg2rad(30) &&
			Math.abs(checkYaw) < deg2rad(this.angle)
		)
			RotationManager.scheduleRotation(
				new RotationPlan(
					new Rotation(
						player[lastReportedYawN] + newYaw,
						RotationManager.activeRotation.pitch,
					),
				),
			);
		// we don't send the attack packet silently,
		// so the Criticals module will automatically send the packets BEFORE this one sends!
		ClientSocket.sendPacket(
			new (PacketRefs.getRef("SPacketUseEntity"))({
				id: e.id,
				action: 1,
				hitVec: new PBVector3({
					x: hitVec.x,
					y: hitVec.y,
					z: hitVec.z,
				}),
			}),
		);
		const d = MATCHED_DUMPS.attackTargetEntityWithCurrentItem as "attack";
		player[d](e);
	}

	@Subscribe("tick")
	onTick() {
		// ghetto ahh method
		let first = true;
		for (const target of findTargets(this.range)) {
			this.block();
			this.sendAttack(target, first);
			first = false;
			this.unblock();
		}
	}
}
