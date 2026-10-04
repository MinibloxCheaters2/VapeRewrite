export enum Priority {
	HIGHEST = 3,
	HIGH = 2,
	NORMAL = 1,
	LOW = 0,
	LOWEST = -1,
	// PacketQueueManager runs here
	FINAL_DECISION = -2,
	READ_FINAL_STATE = -3,
}

import EventBus from "@wq2/event-bus";

import Bus from "../Bus";

export default EventBus;

/**
 * Subscribe decorator (generic — no game-specific event constraint).
 * The game package re-exports this with `K extends keyof ClientEvents`.
 */
export function Subscribe<K extends string>(event: K, priority: number = Priority.NORMAL) {
	return Bus.Subscribe(event, priority);
}

/**
 * Async variant of {@linkcode Subscribe}.
 *
 * > [!IMPORTANT]
 * > AFTER YOU AWAIT TO SOMETHING THAT DOESN'T IMMEDIATELY RESOLVE,
 * > YOUR CHANGES TO THE EVENT WILL NOT APPLY.
 * > ALL EVENTS DO NOT WAIT FOR YOUR LISTENER TO FINISH.
 *
 * @param event The event to subscribe to
 * @param priority How important the event is
 * @returns the actual method decorator
 */
export function SubscribeAsync<K extends string>(event: K, priority: number = Priority.NORMAL) {
	return Subscribe<K>(event, priority);
}
