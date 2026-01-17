import Bus from "../../../../Bus";
import { Subscribe } from "../../../../event/api/Bus";
import CancelableWrapper from "../../../../event/api/CancelableWrapper";
import logger from "../../../../utils/loggers";
import { C2SPacket } from "../../../sdk/types/packetTypes";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Test extends Mod {
  public name = "Test";
  public category = Category.UTILITY;
  public onEnable(): void {
    logger.debug("Test module enabled!");
    Bus.emit("tick");
  }

  @Subscribe("tick")
  onTick() {
    logger.debug("Hello");
  }

  @Subscribe("sendPacket")
  onSendPacket(packet: CancelableWrapper<C2SPacket>) {
    logger.debug("packet sent: ", packet);
  }

  public onDisable(): void {
    logger.debug("Test module disabled!");
  }
}
