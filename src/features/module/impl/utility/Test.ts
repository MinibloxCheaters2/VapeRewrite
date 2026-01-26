import logger from "@/utils/loggers";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Test extends Mod {
	public name = "Test";
	public category = Category.UTILITY;

	public onEnable(): void {
		logger.debug("Test module enabled!");
	}

	// @Subscribe("tick")
	// private onTick() {
	// }

	// @Subscribe("sendPacket")
	// private onSendPacket(packet: CancelableWrapper<C2SPacket>) {
	// }

	public onDisable(): void {
		logger.debug("Test module disabled!");
	}
}
