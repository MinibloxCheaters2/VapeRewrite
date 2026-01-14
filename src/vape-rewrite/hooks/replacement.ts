// the idea of this hook is to move some of the symbols into the window object so we can get them.

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

  for (const [replacement, code] of Object.entries(REPLACEMENTS)) {
    console.info(`Applying replacement: ${replacement}`);
    modified = modified.replace(
      replacement,
      handleReplacement(replacement, code)
    );
    // TODO: handle the 2nd occurrence, which inside a string in a varible called "jsContent".
    // (screw you vector)
  }
  return modified;
}
