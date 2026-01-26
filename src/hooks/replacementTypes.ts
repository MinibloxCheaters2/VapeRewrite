/** Where should we place the code, or should we replace the entire match with that code? */
export enum Shift {
	BEFORE,
	REPLACE,
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
