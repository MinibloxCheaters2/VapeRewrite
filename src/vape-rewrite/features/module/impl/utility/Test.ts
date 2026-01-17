import logger from "../../../../utils/loggers";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Test extends Mod {
  public name = "Test";
  public category = Category.UTILITY;
  public onEnable(): void {
    logger.debug("Test module enabled!");
  }

  public onDisable(): void {
    logger.debug("Test module disabled!");
  }
}
