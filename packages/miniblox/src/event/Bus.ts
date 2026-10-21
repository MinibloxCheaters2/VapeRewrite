export { Priority } from "@vape/core";
export { EventBus as default, EventBus } from "@vape/core";

import type ClientEvents from "./Events";

import {
	Subscribe as CoreSubscribe,
	SubscribeAsync as CoreSubscribeAsync,
} from "@vape/core";
export type { Cancelable } from "@vape/core";
export type { CancelableWrapper } from "@vape/core";

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
