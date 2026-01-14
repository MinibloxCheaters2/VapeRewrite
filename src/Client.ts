function generateSecureRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

function getRandomIntInclusive(min: number, max: number) {
  const mi = Math.ceil(min);
  const ma = Math.floor(max);
  const randomBuffer = new Uint32Array(1);

  crypto.getRandomValues(randomBuffer);

  const randomNumber = randomBuffer[0] / (0xffffffff + 1);

  return Math.floor(randomNumber * (ma - mi + 1)) + mi;
}

export const storeName = generateSecureRandomString(Math.min(getRandomIntInclusive(4, 9)));

export const vapeName = "Vape Rewrite".split("")
  .map(value => ({ value, sort: getRandomIntInclusive(1, 3) }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)
  .join("");

