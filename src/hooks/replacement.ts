// the idea of this hook is to move some of the symbols into the window object so we can get them.

import {
	CHECK_UNMATCHED_DUMPS,
	CHECK_UNMATCHED_REPLACEMENTS,
	LOG_APPLYING_REPLACEMENTS,
} from "../debugControls";
import logger from "../utils/loggers";
import DUMPS, { DumpKey } from "./dump";
import { REPLACEMENTS } from "./replacements";
import { type Replacement, Shift } from "./replacementTypes";

function handleReplacement(
	original: string,
	{ replacement, shift }: Replacement,
): string {
	switch (shift) {
		case Shift.BEFORE:
			return `${replacement}${original}`;
		case Shift.REPLACE:
			return replacement;
		case Shift.AFTER:
		default:
			return `${original}${replacement}`;
	}
}

function matches(code: string, match: string | RegExp): boolean {
	return typeof match === "string"
		? code.includes(match)
		: code.match(match) !== undefined;
}

type DumpKey2Name = Record<DumpKey, string | undefined>;

export let MATCHED_DUMPS: DumpKey2Name;

export default function modifyCode(code: string): string {
	MATCHED_DUMPS ??= {} as DumpKey2Name;
	let modified = code;

	for (const [name, regex] of Object.entries(DUMPS)) {
		const matched = modified.match(regex);
		if (matched?.[1]) {
			MATCHED_DUMPS[name] = matched[1];
			for (let [, { replacement }] of REPLACEMENTS.entries()) {
				replacement = replacement.replaceAll(name, matched[1]);
			}
		} else if (CHECK_UNMATCHED_DUMPS) {
			logger.warn(`Unmatched dump: ${name} with regex`, regex);
		}
	}

	if (CHECK_UNMATCHED_REPLACEMENTS) {
		const unmatchedReplacements = Array.from(REPLACEMENTS.keys()).filter(
			(r) => !matches(modified, r),
		);
		if (unmatchedReplacements.length > 0)
			logger.warn("Unmatched replacements:", unmatchedReplacements);
	}

	for (const [replacement, code] of Array.from(REPLACEMENTS.entries())) {
		if (LOG_APPLYING_REPLACEMENTS)
			logger.info(`Applying replacement: ${replacement}`);
		modified = modified.replace(replacement, (original) =>
			handleReplacement(original, code),
		);
		// note: 2nd occurrence is usually inside a string in a varible called "jsContent".
	}
	return modified;
}
