import { Replacement } from "../replacementTypes";
import {
  ENABLE_ALL_WORLD_TYPES,
  FORCE_ENABLE_RANK_GIFTING,
  STAFF_PRIVATE_WORLD_BYPASS,
  STAFF_PROFILE_SET,
} from "./utils/staffFeatures";
import { FORCE_ENABLE_REPLACEMENT } from "./utils/flags";
import { CORE_REPLACEMENTS } from "./utils/module/core/core";
import {
  SHOW_USERNAMES_WITH_HIDDEN_CHARS,
  SHOW_CLOUDS_SETTING,
  SHOW_CLOUDS_UPDATE_SETTING,
  EXTRA_OPTIONS,
  YOU_HAVE_AURA_MODE,
  ENABLE_CHUNK_CULLING_SETTING,
  GENERATE_CLOUDS_REPLACEMENT,
  TRAIL_AURA_REPLACEMENT,
  ADVANCED_BROWSE_PLANETS_MODAL,
  PLANET_MODEL_EACH_PANEL,
  DEVELOPER_LEADERBOARD,
  STATISTICS_MODE_STATS_REPLACEMENT
} from "./utils/settingReplacement"
import { NOSLOW_REPLACEMENTS } from "./utils/module/noslow";
// an interesting note, remove the type parameters (<string | RegExp, Replacement>) and then TypeScript starts complaining about types not being the same.



export const REPLACEMENTS = new Map<string | RegExp, Replacement>(
  [
    ...CORE_REPLACEMENTS,
    // enable all game modes and disable ads
    FORCE_ENABLE_REPLACEMENT,

    // Enable all ranks gifting
    FORCE_ENABLE_RANK_GIFTING,

    // Enable Debug World Type
    ENABLE_ALL_WORLD_TYPES,

    // Enable Staff Profile Set
    STAFF_PROFILE_SET,

    // Enable Moderator-Private-World Bypass (altDown)
    STAFF_PRIVATE_WORLD_BYPASS,
    // Statistics replacements
    STATISTICS_MODE_STATS_REPLACEMENT,
    // Extra Options
    EXTRA_OPTIONS,
    // Show Usernames with Hidden Characters
    SHOW_USERNAMES_WITH_HIDDEN_CHARS,
    // Show Clouds Setting
    SHOW_CLOUDS_SETTING,
    SHOW_CLOUDS_UPDATE_SETTING,
    // You Have Aura Mode
    YOU_HAVE_AURA_MODE,
    // Enable Chunk Culling Setting
    ENABLE_CHUNK_CULLING_SETTING,
    // Generate Clouds Replacement
    GENERATE_CLOUDS_REPLACEMENT,
    // Trail Aura Replacement
    TRAIL_AURA_REPLACEMENT,
    // Advanced Browse Planets Modal
    ADVANCED_BROWSE_PLANETS_MODAL,
    // Planet Model Each Panel
    PLANET_MODEL_EACH_PANEL,
    // Developer Leaderboard
    DEVELOPER_LEADERBOARD,
    ...NOSLOW_REPLACEMENTS
  ],
);
