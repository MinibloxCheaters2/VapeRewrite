

import { Category } from "@vape/core";
import { Mod } from "@vape/core";



export default class WTap extends Mod {
	public name = "WTap";
	public category = Category.COMBAT;

	// TODO: am lazy
	// @Bus.Subscribe("sendPacket")
	// private onPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
	// 	if (
	// 		isC2S("SPacketUseEntity", packet) &&
	// 		packet.action === 1 /*ATTACK*/ &&
	// 		Miniblox.player.isSprinting()
	// 	) {
	// 		Miniblox.player.serverSprintState = false;
	// 	}
	// }
}
