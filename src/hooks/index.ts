import modifyCode from "./replacement";
import "./hide";

const ORIGIN = self.location.origin;

const IMPORT_SHIM = [
	"const __import=async u=>{",
	"const __b=self.location.origin;",
	"if(!u.startsWith('/')&&!/^[a-z][a-z0-9+.-]*:/i.test(u))",
	"u=__b+'/assets/'+(u.startsWith('./')?u.slice(2):u);",
	"else if(u.startsWith('/'))",
	"u=__b+u;",
	"return import(u)};",
].join("");

function isIndexPath(pathname: string): boolean {
	return pathname.startsWith("/assets/index-") && pathname.endsWith(".js");
}

function isIndexScript(src: string): boolean {
	if (src.length === 0) return false;
	try {
		return isIndexPath(new URL(src).pathname);
	} catch {
		return false;
	}
}

const PATCHED_CACHE = new Map<string, string>();
let MAIN_ENTRY_PATH = "";
let MAIN_BLOB_URL = "";

function fixStaticImports(code: string): string {
	const resolve = (s: string) =>
		`${ORIGIN}/assets/${s.startsWith("./") ? s.slice(2) : s}`;
	const maybeRedirect = (s: string) => {
		const full = resolve(s);
		if (MAIN_ENTRY_PATH && new URL(full).pathname === MAIN_ENTRY_PATH)
			return MAIN_BLOB_URL;
		return full;
	};
	return code
		.replace(
			/from\s*(["'])(\.(?:[^"']+))\1/g,
			(_, q, s) => `from${q}${maybeRedirect(s)}${q}`,
		)
		.replace(/import\s*(["'])(\.(?:[^"']+))\1/g, (m, _q, s) =>
			m.replace(s, maybeRedirect(s)),
		);
}

function patchImport(url: string, src: string): string {
	if (!PATCHED_CACHE.has(url)) {
		PATCHED_CACHE.set(
			url,
			`${IMPORT_SHIM}\n${fixStaticImports(src).replace(/import\s*\(/g, "__import(")}`,
		);
	}
	//biome-ignore lint/style/noNonNullAssertion: lol
	return PATCHED_CACHE.get(url)!;
}

async function execute(src: string, oldScript: HTMLScriptElement) {
	oldScript.type = "javascript/blocked";

	const code = await fetch(src)
		.then((r) => r.text())
		.then(modifyCode);
	const patched = patchImport(src, code);
	const blob = new Blob([patched], { type: "application/javascript" });
	const blobUrl = URL.createObjectURL(blob);

	MAIN_ENTRY_PATH = new URL(src).pathname;
	MAIN_BLOB_URL = blobUrl;

	const s = document.createElement("script");
	s.type = "module";
	s.src = blobUrl;
	document.head.appendChild(s);
}

let hooked = false;

export default function hook() {
	if (hooked) return;
	hooked = true;

	if (navigator.product === "Gecko" && "onbeforescriptexecute" in window) {
		window.addEventListener(
			"beforescriptexecute",
			(e) => {
				const script = e.target as HTMLScriptElement;
				if (isIndexScript(script.src)) {
					e.preventDefault();
					e.stopPropagation();
					execute(script.src, script);
				}
			},
			false,
		);
	} else {
		new MutationObserver(async (mutations, observer) => {
			const oldScript = mutations
				.flatMap((e) => [...Array.from(e.addedNodes)])
				.map((e) => e as HTMLScriptElement)
				.filter((e) => e.tagName === "SCRIPT")
				.find((e) => isIndexScript(e.src));

			if (oldScript) {
				observer.disconnect();
				execute(oldScript.src, oldScript);
			}
		}).observe(document, {
			childList: true,
			subtree: true,
		});
	}
}

hook();
