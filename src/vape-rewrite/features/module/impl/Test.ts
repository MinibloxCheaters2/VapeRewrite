import logger from "../../../utils/loggers";
import Mod, { Category } from "../api/Module";

export default class Test extends Mod {
  public name = "Test";
  public category = Category.SILLY;
  public onEnable(): void {
    logger.debug("Test module enabled!");
  }

  public onDisable(): void {
    logger.debug("Test module disabled!");
  }
}
