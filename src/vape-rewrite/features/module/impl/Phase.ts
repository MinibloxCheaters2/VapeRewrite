import Category from "../api/Category";
import Mod from "../api/Module";

export default class AutoRespawn extends Mod {
  public name = "Phase";
  public category = Category.UTILITY;
  // All functionality will be in hooking-replacements
}
