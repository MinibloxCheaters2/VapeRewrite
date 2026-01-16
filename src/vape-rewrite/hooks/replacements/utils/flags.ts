/**
 * Forces some unleash flags to being disabled or enabled.
 * Example: disable-ads is forced to be enabled and all of the mini-game flags are enabled.
 * @module
 */

import { Shift, SingleReplacement } from "../../replacementTypes";


const FLAGS_TO_FORCE_ENABLE = [
  // Disables... ads.
  "disable-ads",
  //#region Enable all mini games
  "skywars",
  "spleef",
  "eggwars",
  "eggwars2",
  "eggwars3",
  "eggwars4",
  "kitpvp",
  "pvp",
  "duels_bridge",
  "oitq",
  "blockhunt",
  "murder",
  "blitzbuild"
  //#endregion
];

export const FORCE_ENABLE_REPLACEMENT: SingleReplacement = [new RegExp(`index_browserExports\\.useFlag\\("${FLAGS_TO_FORCE_ENABLE.join("|")}"\\)`), {
  replacement: "true",
  shift: Shift.REPLACE
}];
