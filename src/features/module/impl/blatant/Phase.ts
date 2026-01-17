import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Phase extends Mod {
  public name = "Phase";
  public category = Category.BLATANT;
  // All functionality will be in hooking-replacements
}
