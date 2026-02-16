/**
 * These are debug controls for certain things to help debugging Vape!
 * Please do not toggle them unless you know what they do!
 * @module
 */

//#region Store system
/** Logs store names into the console. */
export const LOG_STORE_NAME = true;
/** Logs store names into the console. */
export const LOG_FG_EXPOSED_NAME = true;
/** Disables store name randomization. This makes Vape 20x easier to detect, so please don't toggle it. */
export const NO_STORE_NAME_RANDOMIZATION = false;
/** Disables from-game exposed store randomization. This makes Vape 20x easier to detect, so please don't toggle it. */
export const NO_FG_EXPOSED_RANDOMIZATION = false;
//#endregion
//#region Replacement system
/** Checks for unmatched replacements, and if found, logs the unmatched replacements into the console */
export const CHECK_UNMATCHED_REPLACEMENTS = false;
/** Checks for unmatched dumps, and if found, logs the unmatched dumps into the console. */
export const CHECK_UNMATCHED_DUMPS = false;
/** Logs when we're applying replacements. */
export const LOG_APPLYING_REPLACEMENTS = false;
/** Logs when our remap proxy remaps a field from its normal name to its obfuscated name, it logs as a debug level. */
export const LOG_REMAPPING = false;
//#endregion
