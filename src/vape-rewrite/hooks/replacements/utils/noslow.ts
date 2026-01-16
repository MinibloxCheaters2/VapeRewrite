import { MultipleReplacements, Shift } from "../../replacementTypes";

export const NOSLOW_REPLACEMENTS: MultipleReplacements = [
  ['updatePlayerMoveState(),this.isUsingItem()', {
    replacement: `updatePlayerMoveState(),(this.isUsingItem() && false)`,
    shift: Shift.REPLACE
  }],

  ["S&&!this.isUsingItem()", {
    replacement: 'S&&!(this.isUsingItem() && false)',
    shift: Shift.REPLACE
  }]
];
