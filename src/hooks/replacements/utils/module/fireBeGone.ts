//import { MOD_MANAGER } from "../../../../utils/patchHelper";
import { type MultipleReplacements, Shift } from "../../../replacementTypes";

//const FIREREMOVER = `${MOD_MANAGER}.fireDisabler`;

export const FIREREMOVER_REPLACEMENTS: MultipleReplacements = [
    

   [
     "this.attackEntityFrom(DamageSource.IN_FIRE, u)",
     {
        replacement: `true`,
        shift: Shift.REPLACE,
     }
   ]
];
