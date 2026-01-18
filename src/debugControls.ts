/**
 * These are debug controls for certain things to help debugging Vape!
 * Please do not toggle them unless you know what they do!
 * @module
 */


//#region Store system
/** Logs store names into the console. */
export const LOG_STORE_NAME = true;
/** Disables store name randomization. This makes Vape 20x easier to detect, so please don't toggle it. */
export const NO_STORE_NAME_RANDOMIZATION = false;
//#endregion
//#region Replacement / dump system
/** Checks for unmatched replacements, and if found, logs the unmatched replacements into the console */
export const CHECK_UNMATCHED_REPLACEMENTS = true;
/** Checks for unmatched dumps, and if found, logs the unmatched dumps into the console. */
export const CHECK_UNMATCHED_DUMPS = true;
/** Logs when we're applying replacements. */
export const LOG_APPLYING_REPLACEMENTS = true;
//#endregion
