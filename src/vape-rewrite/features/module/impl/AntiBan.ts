import Category from "../api/Category";
import Mod from "../api/Module";

export default class AntiBan extends Mod {
  name = "AntiBan";
  category = Category.BLATANT;
  // TODO(AntiBan): implement account gen functionality
  public static async getToken(): Promise<string> {
    return "";
  }
}
