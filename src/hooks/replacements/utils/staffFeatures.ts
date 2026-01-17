import { Shift, SingleReplacement } from "../../replacementTypes";

const replacementWorldTypes = `availableWorldTypes = {
		[GameModeId.SURVIVAL]: [WorldGenerationType.NORMAL, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.DEBUG],
		[GameModeId.CREATIVE]: [WorldGenerationType.NORMAL, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.DEBUG],
		[GameModeId.ADVENTURE]: [WorldGenerationType.NORMAL, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.DEBUG]
	},`;


const STAFF_RANK = "1000";
export const FORCE_ENABLE_RANK_GIFTING: SingleReplacement = [
    'jsxRuntimeExports.jsx("option",{value:"legend",children:"Legend"})',
    {
        replacement:
            ',jsxRuntimeExports.jsx("option", { value: "immortal", children: "Immortal" })',
        shift: Shift.AFTER,
    },
];

export const ENABLE_ALL_WORLD_TYPES: SingleReplacement = [
    /availableWorldTypes\s*=\s*\{[\s\S]*?\}\s*,/g,
    {
        replacement: replacementWorldTypes,
        shift: Shift.REPLACE,
    },
];

export const STAFF_PROFILE_SET: SingleReplacement = [
    "getRankLevel(player.profile.rank)",
    {
        replacement: STAFF_RANK,
        shift: Shift.REPLACE,
    },
];
export const STAFF_PRIVATE_WORLD_BYPASS: SingleReplacement = [
    /altDown\s*&&\s*getRankLevel\([\s\S]*?\)/g,
    {
        replacement: `altDown && ${STAFF_RANK}`,
        shift: Shift.REPLACE,
    },
];
