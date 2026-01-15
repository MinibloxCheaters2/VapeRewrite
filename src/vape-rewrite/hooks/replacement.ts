// the idea of this hook is to move some of the symbols into the window object so we can get them.

import { CHECK_UNMATCHED_DUMPS, CHECK_UNMATCHED_REPLACEMENTS, LOG_APPLYING_REPLACEMENTS } from "../../debugControls";
import { DUMPS } from "./dump";

/** Where should we place the code, or should we replace the entire match with that code? */
enum Shift {
  BEFORE,
  REPLACE,
  AFTER
}

interface Replacement {
  replacement: string;
  shift: Shift;
}

interface Replacements {
  [key: string]: Replacement;
}

export const REPLACEMENTS: Replacements = {
  'document.addEventListener("DOMContentLoaded",startGame,!1);': {
    replacement: `setTimeout(function() {
			const DOMContentLoaded_event = document.createEvent("Event");
			DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
			document.dispatchEvent(DOMContentLoaded_event);
		}, 0);`,
    shift: Shift.AFTER
  }
};

function handleReplacement(original: string, {replacement, shift}: Replacement): string {
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


export default function modifyCode(code: string): string {
  let modified = code;

	for (const [name, regex] of Object.entries(DUMPS)) {
		const matched = modified.match(regex);
		if (matched) {
			for (let [, {replacement}] of Object.entries(REPLACEMENTS)) {
				replacement = replacement.replaceAll(name, matched[1]);
			}
		}
	}

  if (CHECK_UNMATCHED_DUMPS) {
    const unmatchedDumps = Object.entries(DUMPS).filter(e => code.match(e[1]) === undefined);
    if (unmatchedDumps.length > 0) console.warn("Unmatched dumps:", unmatchedDumps);
  }

  if (CHECK_UNMATCHED_REPLACEMENTS) {
    const unmatchedReplacements = Object.entries(REPLACEMENTS).filter(r => !modified.includes(r[0]));
    if (unmatchedReplacements.length > 0) console.warn("Unmatched replacements:", unmatchedReplacements);
  }


  for (const [replacement, code] of Object.entries(REPLACEMENTS)) {
    if (LOG_APPLYING_REPLACEMENTS) console.info(`Applying replacement: ${replacement}`);
    modified = modified.replace(
      replacement,
      handleReplacement(replacement, code)
    );
    // TODO: handle the 2nd occurrence, which inside a string in a varible called "jsContent".
    // (screw you vector)
  }
  return modified;
}
