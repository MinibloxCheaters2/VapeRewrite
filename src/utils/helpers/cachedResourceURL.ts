/**
 * Why doesn't ViolentMonkey do this by default...
 * @module
 */

/** Stores resource URLs that are blob URLs */
const blobURLCache: Record<string, string> = {};

/** Stores resource URLs that are data URLs */
const dataURLCache: Record<string, string> = {};

/**
 * @param name Name of a resource defined in the *Metadata Block*.
 * @param [isBlobUrl=true] use a `blob` URL?
 * otherwise it will use a `data` URL. Blob URLs short and cacheable,
 * so blob URLs are good for reusing in multiple DOM elements.
 * It's long so reusing it in DOM may be less performant due to the lack of caching,
 * but it's particularly handy for direct synchronous decoding of the data on sites
 * that forbid fetching `blob:` in their CSP.
 */
export default function getResourceURL(
	name: string,
	isBlobUrl: boolean = true,
) {
	const cache = isBlobUrl ? blobURLCache : dataURLCache;

	cache[name] ??= GM_getResourceURL(name, isBlobUrl);

	return cache[name];
}
