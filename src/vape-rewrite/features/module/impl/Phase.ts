/* eslint-disable */
import logger from "../../../utils/loggers";
import Category from "../api/Category";
import Mod from "../api/Module";

export default class AutoRespawn extends Mod {
  public name = "Phase";
  public category = Category.UTILITY;
  public onEnable(): void {
  }

  public onDisable(): void {
  }
}
