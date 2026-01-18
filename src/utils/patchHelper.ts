import { storeName } from "../Client";
import dump from "../hooks/dump";

export const STORE = `window["${storeName}"]` as const;
export const EXPOSED = `${STORE}.exposed` as const;
export const MOD_MANAGER = `${EXPOSED}.moduleManager` as const;
/** makes a string that accesses a dump */
export function DMP<T extends keyof typeof dump>(n: T) { return `${EXPOSED}.dump.${n}` as const }
