import logger from "../../../utils/loggers";
import Category from "../api/Category";
import Mod from "../api/Module";

export default class Scaffold extends Mod {
  public name = "Scaffold";
  public category = Category.COMBAT;
  public onEnable(): void {
    logger.debug("Scaffold module enabled!");
  }

  public onDisable(): void {
    logger.debug("Scaffold module disabled!");
  }
}
