import { randomIntInclusive } from "./utils/random";

export const COMMAND_PREFIX = "." as const;

export const vapeName = "Vape Rewrite"
	.split("")
	.map((value) => ({ value, sort: randomIntInclusive(1, 2) }))
	.sort((a, b) => a.sort - b.sort)
	.map(({ value }) => value)
	.join("");
