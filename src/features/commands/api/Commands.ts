/* eslint-disable */
import Bus from "../../../Bus";


export default abstract class Command {
    /** Command chat name (what the user types to invoke the command) */
    public abstract name: string;

    /** Command Prefix */
    public abstract prefix: string;

    /** Callback */
   protected callback(): void {}

    /** Description for help */
    public abstract description: string;
}