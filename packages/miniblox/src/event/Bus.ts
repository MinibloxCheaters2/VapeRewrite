export { Priority } from "@vape/core/src/event/Bus";
export { default, default as EventBus } from "@vape/core/src/event/Bus";

import type ClientEvents from "./Events";

import {
	Subscribe as CoreSubscribe,
	SubscribeAsync as CoreSubscribeAsync,
} from "@vape/core/src/event/Bus";
export type { default as Cancelable } from "@vape/core/src/event/Cancelable";
export type { default as CancelableWrapper } from "@vape/core/src/event/CancelableWrapper";

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
