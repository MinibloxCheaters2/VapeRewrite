import { CORE_REPLACEMENTS } from "./replacements/core/core";
import { EXPOSE_REPLACEMENTS } from "./replacements/core/expose";
import { PACKET_RECV_HOOK } from "./replacements/core/packetRecv";
import { ROTATION_REPLACEMENTS } from "./replacements/core/rotation";
import {
	GAME_TICK_EVENT_REPLACEMENT,
	PLAYER_TICK_EVENT_REPLACEMENT,
} from "./replacements/core/tickEvent";
import VERSION_REPLACEMENT from "./replacements/core/version";
import { FORCE_ENABLE_REPLACEMENT } from "./replacements/flags";
import ANTIBAN_REPLACEMENT from "./replacements/modules/antiban";
import { NOSLOW_REPLACEMENTS } from "./replacements/modules/noslow";
import {
	ADVANCED_BROWSE_PLANETS_MODAL,
	DEVELOPER_LEADERBOARD,
	ENABLE_CHUNK_CULLING_SETTING,
	EXTRA_OPTIONS,
	GENERATE_CLOUDS_REPLACEMENT,
	PLANET_MODEL_EACH_PANEL,
	SHOW_CLOUDS_SETTING,
	SHOW_CLOUDS_UPDATE_SETTING,
	SHOW_USERNAMES_WITH_HIDDEN_CHARS,
	STATISTICS_MODE_STATS_REPLACEMENT,
	TRAIL_AURA_REPLACEMENT,
	YOU_HAVE_AURA_MODE,
} from "./replacements/settingReplacement";
import {
	ENABLE_ALL_WORLD_TYPES,
	FORCE_ENABLE_RANK_GIFTING,
	STAFF_DETECTION,
	STAFF_PRIVATE_WORLD_BYPASS,
	STAFF_PROFILE_SET,
	VANISH_BYPASS,
} from "./replacements/staffFeatures";
import { type Match, type Replacement, Shift } from "./replacementTypes";

// an interesting note, remove the type parameters (<string | RegExp, Replacement>) and then TypeScript starts complaining about types not being the same.
export const REPLACEMENTS = new Map<Match, Replacement>([
	...CORE_REPLACEMENTS,
	ANTIBAN_REPLACEMENT,
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
	...NOSLOW_REPLACEMENTS,
	...EXPOSE_REPLACEMENTS,
	GAME_TICK_EVENT_REPLACEMENT,
	PLAYER_TICK_EVENT_REPLACEMENT,
	VANISH_BYPASS,
	STAFF_DETECTION,
	[
		"autoClickerDectectOnClick(game),",
		{
			replacement: "",
			shift: Shift.REPLACE,
		},
	],
	PACKET_RECV_HOOK,
	VERSION_REPLACEMENT,
	...ROTATION_REPLACEMENTS,
]);
