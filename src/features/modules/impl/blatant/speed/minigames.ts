import { Priority, Subscribe } from "@/event/Bus";
import SubModule from "@/features/config/SubModule";
import Miniblox from "@/utils/refs/miniblox";
import type Speed from "./index";
import CancelableWrapper from "@/event/CancelableWrapper";
import { C2SPacket } from "@wq2/miniblox-sdk";
import { isC2S } from "@/utils";

export default class Minigames extends SubModule<Speed> {
	#spoofJump = false;
	@Subscribe("playerTick")
	private onTick(): void {
		const { player } = Miniblox;
		if (!player.isSprinting() || !player.onGround) return;
		player.motion.x -= Math.sin(player.yaw) * .2;
		player.motion.z -= Math.cos(player.yaw) * .2;
		this.#spoofJump = true;
	}

	@Subscribe("sendPacket", Priority.HIGHEST)
	private onSendPacket({ data: pkt }: CancelableWrapper<C2SPacket>) {
		if (!this.#spoofJump) return;
		if (isC2S("SPacketPlayerInput", pkt)) {
			pkt.jump = true;
			this.#spoofJump = false;
		}
	}

	onDisable(): void {
		const { player } = Miniblox;
		player.motion.x = Math.max(Math.min(player.motion.x, 0.3), -0.3);
		player.motion.z = Math.max(Math.min(player.motion.z, 0.3), -0.3);
	}

	getTag(): string {
		return `Minigames`;
	}
}
