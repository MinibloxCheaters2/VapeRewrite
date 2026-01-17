import Bus from "../../../Bus";
import { Category } from "./Category";

export default abstract class Mod {
  /** The name of this module. */
  public abstract name: string;
  /** What category this module is in */
  public abstract category: Category;
  /**
   * ! ONLY use this for toggling the state internally,
   * this won't subscribe or unsubscribe the events
   */
  private state: boolean;

  /**
   * Do NOT override this, override {@link onEnable} instead
   * This registers the module and calls {@link onEnable}.
   */
  private onEnableInternal(): void {
    Bus.registerSubscriber(this);
    this.onEnable();
  }

  /**
   * Do NOT override this, override {@link onEnable} instead.
   * This deregisters the module and calls {@link onDisable}.
   */
  private onDisableInternal(): void {
    Bus.unregisterSubscriber(this);
    this.onDisable();
  }

  /** Called when the module is enabled. */
  protected onEnable(): void {
  }

  /** Called when the module is disabled. */
  protected onDisable(): void {
  }

  /** Toggles this module without sending a notification. */
  public toggleSilently(): void {
    this.enabled = !this.enabled;
  }

  /** Toggles this module and sends a notification. */
  public toggle(): void {
    this.toggleSilently();
    // TODO: implement toggle notifications and dynamic island stuff here
  }

  set enabled(value: boolean) {
    this.state = value;
    if (value) {
      this.onEnableInternal();
    } else {
      this.onDisableInternal();
    }
  }

  get enabled(): boolean {
    return this.state;
  }
}
