/**
 * These are debug controls for certain things to help debugging Vape.
 * Please do not toggle them unless you know what they do!
 * @module
 */

//#region Hooks
const UPDATING_MODE = true;
/** Checks for unmatched dumps, and if found, logs the unmatched dumps into the console. */
export const CHECK_UNMATCHED_DUMPS = UPDATING_MODE;
/** Logs when our remap proxy remaps a field from its normal name to its obfuscated name, it logs as a debug level. */
export const LOG_REMAPPING = false;
//#endregion
