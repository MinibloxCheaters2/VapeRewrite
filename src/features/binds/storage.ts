import ModuleManager, { P } from "@/features/modules/api/ModuleManager";

/** Storage key for all module binds, kept separate from configs so sharing a config never clobbers binds. */
const BINDS_KEY = "vapeBinds";

/**
 * Persists every module's current bind under a dedicated storage key, kept
 * separate from configs so sharing a config never clobbers binds.
 */
export function saveBinds() {
	const binds: Record<string, string> = {};
	for (const mod of ModuleManager.modules) {
		if (mod.bind) binds[mod.name] = mod.bind;
	}
	GM_setValue(BINDS_KEY, JSON.stringify(binds));
}

/** Restores all module binds previously stored by {@link saveBinds}. */
export function loadBinds() {
	let binds: Record<string, string> = {};
	try {
		const raw = GM_getValue<string>(BINDS_KEY, "{}");
		const parsed: unknown = JSON.parse(raw);
		if (parsed !== null && typeof parsed === "object") {
			binds = parsed as Record<string, string>;
		}
	} catch {
		binds = {};
	}
	for (const [name, key] of Object.entries(binds)) {
		const mod = ModuleManager.findModule(P.byName(name));
		if (mod) mod.bind = key;
	}
}
