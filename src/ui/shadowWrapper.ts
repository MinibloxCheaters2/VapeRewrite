export default new (class ShadowWrapper {
	#root: ShadowRoot;
	#wrapper: HTMLDivElement;

	/**
	 * From: https://github.com/crackbob/ballcrack/blob/01c625b5545aa93aded44c8b27b878029dddf883/src/shadowWrapper.js#L5C30-L20C50
	 * @returns A closed shadow root
	 */
	#makeShadowRoot() {
		const iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		const attachShadow = (
			iframe.contentWindow as Window & typeof globalThis
		).Element.prototype.attachShadow;
		iframe.remove();

		const container = document.createElement("div");
		const shadow = attachShadow.apply(container, [{ mode: "closed" }]) as ShadowRoot;
		document.body.appendChild(container);
		return shadow;
	}

	/**
	 * From: https://github.com/crackbob/ballcrack/blob/01c625b5545aa93aded44c8b27b878029dddf883/src/shadowWrapper.js#L5C30-L20C50
	 * @returns A div element inside of a shadow root
	 */
	#makeShadowWrapper() {
		this.#root ??= this.#makeShadowRoot();

		const hostEl = document.createElement("div");
		this.#root.appendChild(hostEl);

		return hostEl;
	}

	get root() {
		this.#root ??= this.#makeShadowRoot();
		return this.#root;
	}

	get wrapper() {
		this.#wrapper ??= this.#makeShadowWrapper();
		return this.#wrapper;
	}
})();
