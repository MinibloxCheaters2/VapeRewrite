import { storeName } from "../Client";
import dump from "../hooks/dump";

export const STORE = `window["${storeName}"]`;
export const EXPOSED = `${STORE}.exposed`;
export const MOD_MANAGER = `${EXPOSED}.moduleManager`;
export function DMP(n: keyof typeof dump): string { return `${EXPOSED}.dump.${n}` }
