// we have to inject early in order to modify the script, and the script is in the `<head>`, so it will execute before us if we use document-body or document-load.
if (document.body === null) {
	await new Promise<void>((res) => {
		document.addEventListener("DOMContentLoaded", () => res());
	});
}

export {};
