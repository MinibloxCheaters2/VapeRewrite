import type { Game } from "@wq2/miniblox-sdk";

function isReactReady(): boolean {
	const elem = document.querySelector<HTMLDivElement>("#react");
	if (!elem) return false;
	const key = Object.keys(elem)[0];
	if (!key) return false;
	const fiber = (
		elem as typeof elem & {
			[k: typeof key]: {
				updateQueue: {
					baseState: { element: { props: { game: Game } } };
				};
			};
		}
	)[key];
	return fiber?.updateQueue?.baseState?.element?.props?.game != null;
}

export function waitForReact(): Promise<void> {
	return new Promise((resolve) => {
		if (isReactReady()) return resolve();
		const observer = new MutationObserver(() => {
			if (isReactReady()) {
				observer.disconnect();
				resolve();
			}
		});
		observer.observe(document, { childList: true, subtree: true });
	});
}
