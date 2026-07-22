import { Subscribe } from "@/event/Bus";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import CancelableWrapper from "@/event/CancelableWrapper";
import { C2SPacket } from "@wq2/miniblox-sdk";
import { isC2S, MAIN_LOGGER as logger } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";
import PacketRefs from "@/utils/network/packetRefs";
import ServerFallDistance from "@/utils/movement/ServerFallDistance";

function teleport(y: number, onGround: boolean) {
	const { ClientSocket, player } = Miniblox;
	ClientSocket.sendPacket(
		new PacketRefs.s.SPacketPlayerPosLook({
			pos: {
				x: player.pos.x,
				y,
				z: player.pos.z,
			},
			onGround,
		}),
	);
	if (PacketRefs.s.SPacketPlayerInput) ClientSocket.sendPacket(
		new PacketRefs.s.SPacketPlayerInput({
			pos: {
				x: player.pos.x,
				y,
				z: player.pos.z,
			},
			sequenceNumber: player.inputSequenceNumber++,
			yaw: player.yaw,
			pitch: player.pitch,
			jump: y > player.pos.y ? true : false,
			down: false,
			left: false,
			right: false,
			sneak: false,
			sprint: player.isSprinting(),
			up: false,
			//@ts-expect-error: it does, just outdated packet def
			onGround,
		}),
	);
}

export default class MaceKill extends Mod {
	public name = "MaceKill";
	public category = Category.BLATANT;

	#fallDistance = this.createSliderSetting("FallDistance", 100, 15, 1_000_000);

	get fallDistance() {
		return this.#fallDistance.value();
	}

	@Subscribe("sendPacket")
	onSendPacket({ data: pkt }: CancelableWrapper<C2SPacket>) {
		if (!isC2S("SPacketUseEntity", pkt) || pkt.action !== 1) return;
		const { ClientSocket, player, Items } = Miniblox;
		if (player.inventory.getCurrentItem()?.item !== Items.mace) return;
		teleport(player.pos.y + this.fallDistance, false);
		teleport(player.pos.y, false);
		player.fallDistance = ServerFallDistance.currentFallDistance;
	}
}
