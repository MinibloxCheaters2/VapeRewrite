import { MultipleReplacements, Shift } from "../../../replacementTypes";
import { storeName } from "../../../../../../Client";

const moduleAccess = `window["${storeName}"].exposed.moduleManager`;

export const PHASE_REPLACEMENTS: MultipleReplacements = [
    [
        `calculateXOffset(A,this.getEntityBoundingBox(),g.x)`,
        {
            replacement: `${moduleAccess}.phase.enabled ? g.x : calculateXOffset(A,this.getEntityBoundingBox(),g.x)`,
            shift: Shift.REPLACE,
        }
    ],
    // replace keypresseddump with smth later
    [
        `calculateYOffset(A,this.getEntityBoundingBox(),g.y)`,
        {
            replacement: ` ${moduleAccess}.phase.enabled && !${moduleAccess}.scaffold.enabled && keyPressedDump("shift") ? g.y : calculateYOffset(A,this.getEntityBoundingBox(),g.y)`,
            shift: Shift.REPLACE,

        }
    ],

    [
        `calculateZOffset(A,this.getEntityBoundingBox(),g.z)`,
        {
            replacement: `${moduleAccess}.phase.enabled ? g.z : calculateZOffset(A,this.getEntityBoundingBox(),g.z)`,
            shift: Shift.REPLACE,
        }
    ],

    [
        `pushOutOfBlocks(u,h,p){`,
        {
            replacement: `if (enabledModules["Phase"]) return;`,
            shift: Shift.AFTER,
        }
    ]
]