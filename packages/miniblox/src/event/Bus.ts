export { Priority } from "@vape-rewrite/core";
export { EventBus as default, EventBus } from "@vape-rewrite/core";

import type ClientEvents from "./Events";

import {
	Subscribe as CoreSubscribe,
	SubscribeAsync as CoreSubscribeAsync,
} from "@vape-rewrite/core";
export type { Cancelable } from "@vape-rewrite/core";
export type { CancelableWrapper } from "@vape-rewrite/core";

/**
 * Typed Subscribe decorator — constrains K to keyof ClientEvents.
 */
export function Subscribe<K extends keyof ClientEvents>(event: K, priority?: number) {
	return CoreSubscribe<K>(event, priority);
}

/**
 * Typed SubscribeAsync decorator — constrains K to keyof ClientEvents.
 */
export function SubscribeAsync<K extends keyof ClientEvents>(event: K, priority?: number) {
	return CoreSubscribeAsync<K>(event, priority);
}
