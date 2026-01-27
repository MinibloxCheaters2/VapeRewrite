import { fgExposedName, storeName } from "./names";
import dump from "../hooks/dump";
import { ExposedFromGame } from "../hooks/exposed";

export const STORE = `window["${storeName}"]` as const;
export const EXPOSED = `${STORE}.exposed` as const;
export const MOD_MANAGER = `${EXPOSED}.moduleManager` as const;
export const COMMAND_MANAGER = `${EXPOSED}.commandManager` as const;
export const FG_EXPOSED = `window["${fgExposedName}"]` as const;

/** makes a string that accesses a dump */
export function DMP<T extends keyof typeof dump>(n: T) { return `${EXPOSED}.dump.${n}` as const }
/**
 * exposes {@linkcode name} to the {@linkcode ExposedFromGame} inside of {@linkcode STORE}
 * @param name what should we exposed into {@linkcode FG_EXPOSED}?
 * @param expr an expression, this should usually be just an identifier.
 * @returns `${FG_EXPOSED}.${name} = ${expr}`
 */
export function EXPOSE_AS<T extends keyof ExposedFromGame, X extends string>(name: T, expr: X) {
	return `${FG_EXPOSED}.${name} = ${expr}` as const;
}
