const keybindCallbacks = {};
export const holder = { keybindCallbacks };

unsafeWindow.addEventListener("keydown", (e) => {
	const func = keybindCallbacks[e.key.toLowerCase()];
	if (func) func(e);
});
