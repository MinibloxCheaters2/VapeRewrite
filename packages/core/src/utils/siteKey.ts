const SITE_ID = GM_info.script.namespace;

export function siteKey(key: string): string {
	return `${SITE_ID}/${key}`;
}
