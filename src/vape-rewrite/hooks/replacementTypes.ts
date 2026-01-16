
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

export interface Replacements {
  [key: string]: Replacement;
}
