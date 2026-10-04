export { Priority } from "@vape/core/event/Bus";
export { default, default as EventBus } from "@vape/core/event/Bus";

import type ClientEvents from "./Events";

import {
	Subscribe as CoreSubscribe,
	SubscribeAsync as CoreSubscribeAsync,
} from "@vape/core/event/Bus";
export type { default as Cancelable } from "@vape/core/event/Cancelable";
export type { default as CancelableWrapper } from "@vape/core/event/CancelableWrapper";

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
