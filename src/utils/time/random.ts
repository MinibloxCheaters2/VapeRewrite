export function randomString(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) =>
        `0${(byte & 0xff).toString(16)}`.slice(-2),
    ).join("");
}

export function randomIntInclusive(min: number, max: number) {
    const mi = Math.ceil(min);
    const ma = Math.floor(max);
    const randomBuffer = new Uint32Array(1);

    crypto.getRandomValues(randomBuffer);

    const randomNumber = randomBuffer[0] / (0xffffffff + 1);

    return Math.floor(randomNumber * (ma - mi + 1)) + mi;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
