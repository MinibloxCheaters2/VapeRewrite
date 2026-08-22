import type CancelableWrapper from "@vape/core/event/CancelableWrapper";
import type { C2SPacket } from "@wq2/miniblox-sdk";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import { Subscribe } from "@/event/Bus";
import { isC2S, sendSilently } from "@/utils";
import PacketRefs from "@/utils/network/packetRefs";
import Miniblox from "@/utils/refs/miniblox";

function teleport(y: number, onGround: boolean) {
	const { player } = Miniblox;
	sendSilently(
		new PacketRefs.s.SPacketPlayerPosLook({
			pos: {
				x: player.pos.x,
				y,
				z: player.pos.z,
			},
			onGround,
		}),
	);
}

export default class MaceKill extends Mod {
	name = "MaceKill";
	category = Category.BLATANT;

	#fallDistance = this.createSliderSetting("FallDistance", 60, 20, 400);

	private get fallDistance() {
		return this.#fallDistance.value();
	}
	hackyFallDamageFix = false;

	@Subscribe("sendPacket")
	onSendPacket({ data: pkt }: CancelableWrapper<C2SPacket>) {
		// if (this.hackyFallDamageFix && isC2S("SPacketPlayerPosLook", pkt) && pkt.onGround) {
		// 	pkt.onGround = false;
		// 	this.hackyFallDamageFix = false;
		// }
		if (!isC2S("SPacketUseEntity", pkt) || pkt.action !== 1) return;
		const { player, Items } = Miniblox;
		if (player.inventory.getCurrentItem()?.item !== Items.mace) return;
		teleport(player.pos.y + this.fallDistance, false);
		teleport(player.pos.y + (this.fallDistance - 0.08), false);
		teleport(player.pos.y, false);
		// this.hackyFallDamageFix = true;
	}
}
