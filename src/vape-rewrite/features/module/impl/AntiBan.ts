import Mod, { Category } from "../api/Module";

export default class AntiBan extends Mod {
  name = "AntiBan";
  category = Category.MISC;
  // TODO(AntiBan): implement account gen functionality
  public static getToken(): string {
    return "";
  }
}
