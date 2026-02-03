import { randomIntInclusive } from "./utils/random";

export const COMMAND_PREFIX = "." as const;

export const INJECT_DATE = new Date();

// on April 1st, Baby Oil Rewrite. otherwise, Vape Rewrite.
export const REAL_CLIENT_NAME =
	INJECT_DATE.getMonth() === 3 && INJECT_DATE.getDate() === 1
		? ("Baby Oil Rewrite" as const)
		: ("Vape Rewrite" as const);

export const clientName = REAL_CLIENT_NAME.split("")
	.map((value) => ({ value, sort: randomIntInclusive(0, 2) }))
	.sort((a, b) => a.sort - b.sort)
	.map(({ value }) => value)
	.join("");
