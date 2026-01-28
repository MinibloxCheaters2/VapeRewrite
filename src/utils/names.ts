/**
 * Holds names for stuff so we can randomize them to avoid detections.
 * @module
 */

import { LOG_FG_EXPOSED_NAME, LOG_STORE_NAME, NO_FG_EXPOSED_RANDOMIZATION, NO_STORE_NAME_RANDOMIZATION } from "@/debugControls";
import logger from "./loggers";
import { randomIntInclusive, randomString } from "./random";

export const storeName = NO_STORE_NAME_RANDOMIZATION
	? "VapeStore"
	: randomString(randomIntInclusive(4, 9));

export const fgExposedName = NO_FG_EXPOSED_RANDOMIZATION
	? "VapeFgExposed"
	: randomString(randomIntInclusive(4, 9));

if (NO_STORE_NAME_RANDOMIZATION)
	logger.warn(
		"Store name randomization disabled, only disable store name randomization for debugging or development purposes!",
	);

if (LOG_STORE_NAME) logger.info(`Store name is ${storeName}`);
if (LOG_FG_EXPOSED_NAME)
	logger.info(`from-game exposed store name is ${fgExposedName}`);

export const dragHandleAttrName = `data-${randomString(randomIntInclusive(1, 3))}`;
