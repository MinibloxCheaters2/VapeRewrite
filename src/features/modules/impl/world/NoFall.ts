import type { C2SPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import { isC2S } from "@/utils";
import PacketFallDistance from "@/utils/movement/ServerFallDistance";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

/**
 * max fall height (defaults to 3) - buffer, idk what a good value is, since
 * if you start falling ~6 blocks per tick then
 * you get half a heart of fall damage
 */
const FALL_HEIGHT_BUFFER = 0.5;
/** Too lazy to make a dump for getMaxFallHeight, and it always returns 3 anyway */
const MAX_FALL_HEIGHT = 3;

export default class NoFall extends Mod {
	public name = "NoFall";
	public category = Category.WORLD;
	#modeSetting = this.createDropdownSetting("Mode", ["Normal", "Ground Spoof"]);
	#doJump = false;

	private get mode() {
		return this.#modeSetting.value();
	}

	protected onEnable(): void {}

	@Subscribe("sendPacket")
	onPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (isC2S("SPacketPlayerPosLook", packet)) {
			switch (this.mode) {
				// https://github.com/CCBlueX/LiquidBounce/blob/nextgen/src/main/kotlin/net/ccbluex/liquidbounce/features/module/modules/player/nofall/modes/NoFallHypixel.kt
				// works best with maces and other stuff that requires your fall distance to be accurate
				case "Normal":
					{
						if (
							PacketFallDistance.currentFallDistance >=
							/*Miniblox.player.getMaxFallHeight()*/ MAX_FALL_HEIGHT - FALL_HEIGHT_BUFFER
						)
							this.#doJump = true;
						if (this.#doJump) {
							const { player } = Miniblox;
							if (!player.onGround) return;
							packet.onGround = false;
							player.pos.setY(player.pos.y + 0.09);
							this.#doJump = false;
						}
					}
					break;
				case "Ground Spoof": {
					if (
						!packet.onGround &&
						PacketFallDistance.currentFallDistance >=
							/*Miniblox.player.getMaxFallHeight()*/ MAX_FALL_HEIGHT - FALL_HEIGHT_BUFFER
					) {
						packet.onGround = true;
						Miniblox.player.fallDistance = 0;
					}
					break;
				}
			}
		}
	}
}
