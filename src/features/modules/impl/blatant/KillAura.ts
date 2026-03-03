import { Subscribe } from "@/event/api/Bus";
import type { Entity } from "@/features/sdk/types/entity";
import RotationManager, { RotationPlan } from "@/utils/aiming/rotate";
import Rotation from "@/utils/aiming/rotation";
import PacketRefs from "@/utils/packetRefs";
import deg2rad from "@/utils/radians";
import Refs from "@/utils/refs";
import { findTargets } from "@/utils/target";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import { dynamicIsland } from "../../DynamicIsland";

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
	private lastAttackTime = 0;
	private killauraShowingDI = false;

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
				// auto-remapping proxy!
				playerControllerMP.syncItem();
				ClientSocket.sendPacket(new PacketRefs.s.SPacketUseItem());
				this.blocking = true;
			}
		} else this.blocking = false;
	}

	unblock() {
		if (this.blocking) {
			const { ClientSocket, BlockPos, EnumFacing, playerControllerMP } =
				Refs;
			// auto-remapping proxy again lol
			playerControllerMP.syncItem();
			ClientSocket.sendPacket(
				new PacketRefs.s.SPacketPlayerAction({
					position: BlockPos.ORIGIN.toProto(),
					facing: EnumFacing.DOWN.getIndex(),
					action: 5, // PBAction.RELEASE_USE_ITEM
				}),
			);
			this.blocking = false;
		}
	}

	sendAttack(e: Entity, first: boolean) {
		const { ClientSocket, player } = Refs;
		const box = e.getEntityBoundingBox();
		const hitVec = player.getEyePos().clone().clamp(box.min, box.max);

		const aimPos = player.pos.clone().sub(e.pos);
		const newYaw = wrapAngleTo180_radians(
			Math.atan2(aimPos.x, aimPos.z) - player.lastReportedYaw,
		);
		const checkYaw = wrapAngleTo180_radians(
			Math.atan2(aimPos.x, aimPos.z) - player.yaw,
		);
		if (
			first &&
			Math.abs(checkYaw) > MAX_OFFSET_RAD &&
			Math.abs(checkYaw) < deg2rad(this.angle)
		) {
			RotationManager.scheduleRotation(
				new RotationPlan(
					new Rotation(
						player.lastReportedYaw + newYaw,
						RotationManager.activeRotation.pitch,
					),
				),
			);
		}
		// we don't send the attack packet silently,
		// so the Criticals module will automatically send the packets BEFORE this one sends!
		ClientSocket.sendPacket(
			new PacketRefs.s.SPacketUseEntity({
				id: e.id,
				action: 1,
				hitVec: {
					x: hitVec.x,
					y: hitVec.y,
					z: hitVec.z,
				},
			}),
		);
		// since we're using Refs.player directly instead of Refs.game.player, the call automatically gets remapped to the obfuscated name!
		player.attack(e);
	}

	@Subscribe("gameTick")
	onTick() {
		// ghetto ahh method
		let first = true;
		const targets = findTargets(this.range);
		let attacked = 0;

		for (const target of targets) {
			this.block();
			this.sendAttack(target, first);
			first = false;
			this.unblock();
			attacked++;
		}

		// Update last attack time when attacking
		if (attacked > 0) {
			this.lastAttackTime = Date.now();
		}

		// Show Dynamic Island with target info (with 1 second grace period)
		try {
			console.log("KillAura checking DI, targets:", targets.length);
			if (dynamicIsland) {
				const timeSinceLastAttack = Date.now() - this.lastAttackTime;
				if (
					targets.length > 0 &&
					targets[0] &&
					timeSinceLastAttack < 1000
				) {
					const target = targets[0] as any; // Cast to any since findTargets returns EntityLivingBase
					const health = target.getHealth?.() || 0;
					const maxHealth = target.getMaxHealth?.() || 20;
					// Remove rich text formatting
					const cleanName = (target.name || "Unknown").replace(
						/\\[a-z]+\\/g,
						"",
					);

					dynamicIsland.show({
						duration: 0,
						width: 300,
						height: 60,
						elements: [
							{
								type: "text",
								content: cleanName,
								x: 0,
								y: -12,
								color: "#fff",
								size: 15,
								bold: true,
							},
							{
								type: "text",
								content:
									Math.round(health) +
									"/" +
									maxHealth +
									" HP",
								x: 0,
								y: 8,
								color: "#aaa",
								size: 11,
							},
							{
								type: "progress",
								value: health / maxHealth,
								x: 0,
								y: 22,
								width: 260,
								height: 4,
								color: "#ff4444",
								rounded: true,
							},
						],
					});
					this.killauraShowingDI = true;
				} else if (
					timeSinceLastAttack >= 1000 &&
					this.killauraShowingDI
				) {
					// Only hide if Killaura was showing it
					dynamicIsland.hide();
					this.killauraShowingDI = false;
				}
			}
		} catch (_e) {
			// Dynamic Island not available
		}
	}

	protected onDisable(): void {
		// Hide Dynamic Island if Killaura was showing it
		try {
			if (this.killauraShowingDI && dynamicIsland) {
				dynamicIsland.hide();
				this.killauraShowingDI = false;
			}
		} catch (_e) {
			// Dynamic Island not available
		}
	}
}
