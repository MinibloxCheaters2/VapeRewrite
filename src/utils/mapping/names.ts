/**
 * Holds names for stuff so we can randomize them to avoid detections.
 * @module
 */

import { randomIntInclusive, randomString } from "../time/random";

export const dragHandleAttrName = `data-${randomString(randomIntInclusive(1, 3))}`;
export const exposedName = randomString(randomIntInclusive(9, 11));
