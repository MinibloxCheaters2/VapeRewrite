
/** Where should we place the code, or should we replace the entire match with that code? */
export enum Shift {
  BEFORE,
  REPLACE,
  AFTER
}

export interface Replacement {
  replacement: string;
  shift: Shift;
}

export type Replacements = Map<string | RegExp, Replacement>;
export type SingleReplacement = [string | RegExp, Replacement];
export type MultipleReplacements = SingleReplacement[];
