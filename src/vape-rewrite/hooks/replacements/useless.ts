import { Replacement, Shift } from "../replacementTypes";

const replacementWorldTypes = `availableWorldTypes = {
  [GameModeId.SURVIVAL]: [WorldGenerationType.NORMAL, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.DEBUG],
  [GameModeId.CREATIVE]: [WorldGenerationType.NORMAL, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.DEBUG],
  [GameModeId.ADVENTURE]: [WorldGenerationType.NORMAL, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.DEBUG]
},`;

export const EXTRA_REPLACEMENTS: [string | RegExp, Replacement][] = [
  // Enable all ranks gifting
  ['jsxRuntimeExports.jsx("option",{value:"legend",children:"Legend"})', {
    replacement:
      `,jsxRuntimeExports.jsx("option", { value: "immortal", children: "Immortal" })`,
    shift: Shift.AFTER,
  }],

  // Enable Debug World Type
  [/availableWorldTypes\s*=\s*\{[\s\S]*?\}\s*,/g, {
    replacement: replacementWorldTypes,
    shift: Shift.REPLACE,
  }],    // Enable Moderator-Only Features
  ['getRankLevel(player.profile.rank)', {
    replacement: '1000',
    shift: Shift.REPLACE,
  }],

  // Enable Moderator-Private-World Bypass (altDown)
  [/altDown\s*&&\s*getRankLevel\([\s\S]*?\)/g, {
    replacement: 'altDown && 1000',
    shift: Shift.REPLACE,
  }]
];
