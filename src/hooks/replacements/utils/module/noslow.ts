import { EXPOSED } from "../../../../utils/patchHelper";
import { MultipleReplacements, Shift } from "../../../replacementTypes";

export const NOSLOW_REPLACEMENTS: MultipleReplacements = [
  ['updatePlayerMoveState(),this.isUsingItem()', {
    replacement: `updatePlayerMoveState(),(this.isUsingItem() && !${EXPOSED}.moduleManager.noSlow.enabled)`,
    shift: Shift.REPLACE
  }],

  ["S&&!this.isUsingItem()", {
    replacement: `S&&!(this.isUsingItem() && !${EXPOSED}.moduleManager.noSlow.enabled)`,
    shift: Shift.REPLACE
  }]
];
