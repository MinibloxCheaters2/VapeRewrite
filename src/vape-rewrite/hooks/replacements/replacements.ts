import { Replacement } from "../replacementTypes";
import { CORE_REPLACEMENTS } from "./core";
import { FORCE_ENABLE_REPLACEMENT } from "./forceUnleashFlags";
import { EXTRA_REPLACEMENTS } from "./useless";

// an interesting note, remove the type parameters (<string | RegExp, Replacement>) and then TypeScript starts complaining about types not being the same.
export const REPLACEMENTS = new Map<string | RegExp, Replacement>(
  [
    ...CORE_REPLACEMENTS,

    FORCE_ENABLE_REPLACEMENT,

    ...EXTRA_REPLACEMENTS
  ],
);
