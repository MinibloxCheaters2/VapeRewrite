/**
 * Fetches all mirrors and gives a list of `@match`es for them
 * @module
 */

interface Mirror {
	host: string;
}

interface Response {
	mirrors: Mirror[];
	updatedAt: number;
}

const {mirrors, updatedAt} = await fetch("https://miniblox.io/auth-api/mirrors", {
	headers: {
		accept: "*/*",
		"accept-language": "en-US,en;q=0.9",
		"cache-control": "no-cache",
		pragma: "no-cache",
		priority: "u=1, i",
		"sec-ch-ua": "\"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"",
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": "\"Linux\"",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-origin",
	},
	referrer: "https://miniblox.io/",
	body: null,
	method: "GET",
	mode: "cors",
	credentials: "omit"
}).then(m => m.json() as Promise<Response>);

console.log("//#region mirrors (updated automatically by scripts/mirrors.ts, do NOT REDEEM)");
console.log(mirrors.map(x => `// @match       https://*.${x.host}/*`).join("\n"));
console.log("//#endregion");

export {};
