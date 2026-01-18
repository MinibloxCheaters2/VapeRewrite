import { LOG_STORE_NAME, NO_STORE_NAME_RANDOMIZATION } from "./debugControls";
import logger from "./utils/loggers";

function randomString(length: number): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) =>
		(`0${(byte & 0xff).toString(16)}`).slice(-2),
	).join("");
}

function randomIntInclusive(min: number, max: number) {
	const mi = Math.ceil(min);
	const ma = Math.floor(max);
	const randomBuffer = new Uint32Array(1);

	crypto.getRandomValues(randomBuffer);

	const randomNumber = randomBuffer[0] / (0xffffffff + 1);

	return Math.floor(randomNumber * (ma - mi + 1)) + mi;
}

export const storeName = NO_STORE_NAME_RANDOMIZATION
	? "VapeStore"
	: randomString(Math.min(randomIntInclusive(4, 9)));

if (NO_STORE_NAME_RANDOMIZATION)
	logger.warn(
		"Store name randomization disabled, only disable store name randomization for debugging or development purposes!",
	);
if (LOG_STORE_NAME) logger.info(`Store name is ${storeName}`);

export const vapeName = "Vape Rewrite"
	.split("")
	.map((value) => ({ value, sort: randomIntInclusive(1, 3) }))
	.sort((a, b) => a.sort - b.sort)
	.map(({ value }) => value)
	.join("");
