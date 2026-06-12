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

import EventBus, { Subscribe as origSubscribe } from "@wq2/event-bus";
import type ClientEvents from "./Events";
export default EventBus;
// export type { EventDict } from "@wq2/event-bus";

export function Subscribe<K extends keyof ClientEvents>(
	event: K,
	priority: number = Priority.NORMAL,
) {
	return origSubscribe<ClientEvents, K>(event, priority);
}

/**
 * Subscribes to an event asynchronously.
 * This has a race condition where if a new event gets emitted while you're waiting,
 * you'll start the new event instead of waiting for the previous one to finish.
 * > [!IMPORTANT]
 * > ⚠️⚠️⚠️
 * > AFTER YOU AWAIT TO SOMETHING THAT DOESN'T IMMEDIATELY RESOLVE, YOUR CHANGES TO THE EVENT WILL NOT APPLY.
 * > ALL EVENTS DO NOT WAIT FOR YOUR LISTENER TO FINISH.
 * > I KNOW ProgSKID-CC WILL USE THIS AND WONDER WHY HIS STUFF DOESN'T WORK, BUT HE PROBABLY WILL STILL WONDER WHY ANYWAY.
 * > ⚠️⚠️⚠️
 * @param event The event to subscribe to
 * @param priority How important the event is
 * @returns the actual method decorator
 */
export function SubscribeAsync<K extends keyof ClientEvents>(
	event: K,
	priority: number = Priority.NORMAL,
): <A extends ClientEvents[K] = ClientEvents[K]>(
	_target: unknown,
	mdc: ClassMethodDecoratorContext<
		unknown,
		A extends void ? () => Promise<void> : (e: A) => Promise<void>
	> & {
		name: string;
	},
) => void {
	return Subscribe<K>(event, priority);
}
