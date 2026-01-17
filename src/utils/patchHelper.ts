import { storeName } from "../Client";

export const STORE = `window["${storeName}"]`;
export const EXPOSED = `${STORE}.exposed`;
export const MOD_MANAGER = `${EXPOSED}.moduleManager`;
