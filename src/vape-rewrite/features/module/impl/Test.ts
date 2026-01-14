import Mod, { Category } from "../api/Module";

export default class Test extends Mod {
  public name = "Test";
  public category = Category.SILLY;
  public onEnable(): void {
    console.log("Enabled!");
  }

  public onDisable(): void {
    console.log("Disabled!");
  }
}
