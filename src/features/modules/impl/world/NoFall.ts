import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import PacketFallDistance from "@/utils/ServerFallDistance";
import Category from "../../api/Category";
import Mod from "../../api/Module";

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
			packet instanceof PacketRefs.getRef("SPacketPlayerPosLook") &&
			!packet.onGround &&
			PacketFallDistance.currentFallDistance >= Refs.player.getMaxFallHeight() - FALL_HEIGHT_BUFFER
		) {
			packet.onGround = true;
			Refs.player.fallDistance = 0.0;
		}
	}
}
