import type { C2SPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import PacketFallDistance from "@/utils/movement/ServerFallDistance";
import { c2s } from "@/utils/network/packetRefs";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import { isC2S } from "@/utils";

/**
 * max fall high (defaults to 3) - buffer, idk what a good value is, since
 * if you start falling ~6 blocks per tick then
 * you get half a heart of fall damage
 */
export const FALL_HEIGHT_BUFFER = 0.5;

export default class NoFall extends Mod {
	public name = "NoFall";
	public category = Category.WORLD;

	protected onEnable(): void {}

	@Subscribe("sendPacket")
	onPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (
			isC2S("SPacketPlayerPosLook", packet) &&
			!packet.onGround &&
			PacketFallDistance.currentFallDistance >=
				Miniblox.player.getMaxFallHeight() - FALL_HEIGHT_BUFFER
		) {
			packet.onGround = true;
			Miniblox.player.fallDistance = 0.0;
		}
	}
}
