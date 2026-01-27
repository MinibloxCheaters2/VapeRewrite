import { randomIntInclusive } from "./utils/random";

export const COMMAND_PREFIX = "." as const;

export const vapeName = "Wape Vewrite"
	.split("")
	.map((value) => ({ value, sort: randomIntInclusive(1, 3) }))
	.sort((a, b) => a.sort - b.sort)
	.map(({ value }) => value)
	.join("");
