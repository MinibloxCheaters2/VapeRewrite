import type { EntityLivingBase } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import RotationManager, { RotationPlan } from "@/utils/aiming/rotate";
import Rotation from "@/utils/aiming/rotation";
import deg2rad from "@/utils/math/radians";
import { SETTING } from "@/utils/movement/MovementCorrection";
import { stampTarget } from "@/utils/movement/TargetTracker";
import { findTargets } from "@/utils/movement/target";
import PacketRefs from "@/utils/network/packetRefs";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

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

/** max offset you can be looking away from a player in degrees */
const MAX_OFFSET_DEG = 30;
/** max offset you can be looking away from a player in radians */
const MAX_OFFSET_RAD = deg2rad(MAX_OFFSET_DEG);

export default class KillAura extends Mod {
	public name = "KillAura";
	public category = Category.BLATANT;
	// private attackDelay = Date.now();
	private blocking = false;

	// Settings
	private rangeSetting = this.createSliderSetting("Range", 6, 3, 10, 0.5);
	private angleSetting = this.createSliderSetting("Angle", 360, 1, 360, 1);
	private autoBlockSetting = this.createToggleSetting("Auto Block", true);
	private wallCheckSetting = this.createToggleSetting("Wall Check", false);
	private movementCorrectionSetting = this.createDropdownSetting("Movement Correction", SETTING);

	get movementCorrection() {
		return this.movementCorrectionSetting.value();
	}

	get range() {
		return this.rangeSetting.value();
	}

	get angle() {
		return this.angleSetting.value();
	}

	get autoBlock() {
		return this.autoBlockSetting.value();
	}

	get wallCheck() {
		return this.wallCheckSetting.value();
	}

	block() {
		if (!this.autoBlock) {
			this.blocking = false;
			return;
		}
		if (this.blocking) return;
		const { ClientSocket, playerControllerMP, player, world, playerController } = Miniblox;
		// auto-remapping proxy!
		playerControllerMP.syncItem();
		const { SPacketUseItem } = PacketRefs.s;
		if (SPacketUseItem) {
			ClientSocket.sendPacket(
				new PacketRefs.s.SPacketUseItem({
					initialPress: true,
					button: "right",
					hand: 0, // MAIN_HAND
				}),
			);
		} else {
			playerController.sendUseItem(player, world, player.getHeldItem());
		}
		this.blocking = true;
	}

	unblock() {
		if (!this.blocking) return;
		const { ClientSocket, BlockPos, EnumFacing, player, playerControllerMP, playerController } =
			Miniblox;
		// auto-remapping proxy again lol
		playerControllerMP.syncItem();
		const { SPacketPlayerAction } = PacketRefs.s;
		if (!SPacketPlayerAction) {
			playerController.onStoppedUsingItem(player);
		} else {
			ClientSocket.sendPacket(
				new PacketRefs.s.SPacketPlayerAction({
					position: BlockPos.ORIGIN.toProto(),
					facing: EnumFacing.DOWN.getIndex(),
					action: 5, // PBAction.RELEASE_USE_ITEM
				}),
			);
		}
		this.blocking = false;
	}

	sendAttack(e: EntityLivingBase, first: boolean) {
		const { ClientSocket, player } = Miniblox;
		const box = e.getEntityBoundingBox();
		const hitVec = player.getEyePos().clone().clamp(box.min, box.max);

		stampTarget(e);

		const aimPos = player.pos.clone().sub(e.pos);
		const newYaw = wrapAngleTo180_radians(Math.atan2(aimPos.x, aimPos.z) - player.lastReportedYaw);
		const checkYaw = wrapAngleTo180_radians(Math.atan2(aimPos.x, aimPos.z) - player.yaw);

		if (first && Math.abs(checkYaw) > MAX_OFFSET_RAD && Math.abs(checkYaw) < deg2rad(this.angle)) {
			RotationManager.scheduleRotation(
				new RotationPlan(
					new Rotation(player.lastReportedYaw + newYaw, RotationManager.activeRotation.pitch),
					this.movementCorrection.value,
					1,
				),
			);
		}

		const { SPacketUseEntity } = PacketRefs.s;
		if (SPacketUseEntity === undefined) {
			// in case you haven't attacked yet
			const [oldYaw, oldPitch] = [player.yaw, player.pitch];
			const oldHitVec = Miniblox.playerController.objectMouseOver.hitVec;
			player.yaw = RotationManager.activeRotation.yaw;
			player.pitch = RotationManager.activeRotation.pitch;
			Miniblox.playerController.objectMouseOver.hitVec = hitVec;
			Miniblox.playerController.attackEntity(e);
			Miniblox.playerController.objectMouseOver.hitVec = oldHitVec;
			player.yaw = oldYaw;
			player.pitch = oldPitch;
		} else {
			ClientSocket.sendPacket(
				new SPacketUseEntity({
					id: e.id,
					action: 1,
					hitVec: {
						x: hitVec.x,
						y: hitVec.y,
						z: hitVec.z,
					},
					//@ts-expect-error: it's new
					yaw: RotationManager.activeRotation.yaw,
					pitch: RotationManager.activeRotation.pitch,
					sequence: player.inputSequenceNumber,
				}),
			);
			player.attack(e);
		}
	}

	@Subscribe("playerTick")
	onTick() {
		// ghetto ahh method
		let first = true;
		const targets = findTargets(this.range, this.angle, this.wallCheck);
		this.block();
		for (const target of targets) {
			this.sendAttack(target, first);
			first = false;
		}
		this.unblock();
	}
}
