/** Where should we place the code, or should we replace the entire match with that code? */
export enum Shift {
	/**
	 * Places the replacement BEFORE the code:
	 * ```js
	 * `${replacement}${original}`
	 * ```
	 */
	BEFORE,
	/**
	 * replaces the entire matched code with the replacement text:
	 * ```js
	 * `${replacement}`
	 * ```
	 */
	REPLACE,
	/**
	 * Places the replacement AFTER the code:
	 * ```js
	 * `${original}${replacement}`
	 * ```
	 */
	AFTER,
}

export interface Replacement {
	replacement: string;
	shift: Shift;
}

export type Match = string | RegExp;

export type Replacements = Map<Match, Replacement>;
export type SingleReplacement = [Match, Replacement];
export type MultipleReplacements = SingleReplacement[];
