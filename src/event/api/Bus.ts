import type ClientEvents from "./Events.ts";

export enum Priority {
	HIGHEST = 100,
	HIGH = 75,
	NORMAL = 50,
	LOW = 25,
	LOWEST = 0,
	// PacketQueueManager runs here
	FINAL_DECISION = -250,
	READ_FINAL_STATE = -500
}

interface HandlerEntry<E = unknown> {
	handler: (payload: E) => void;
	priority: number;
}

interface Idk<T extends Record<string, unknown>> {
	__handlers: {
		event: PropertyKey;
		handler: (value: unknown) => void;
	}[];
	__subscriptions: Subscription<T>[];
}

export default class EventBus<Events extends Record<string, unknown>> {
	private listeners: Partial<{
		[K in keyof Events]: Array<HandlerEntry<Events[K]>>;
	}> = {};

	on<K extends keyof Events>(
		event: K,
		listener: (payload: Events[K]) => void,
		priority: number = Priority.NORMAL,
	): void {
		this.listeners[event] ??= [];
		this.listeners[event]?.push({ handler: listener, priority });
		// higher priority first
		this.listeners[event]?.sort((a, b) => b.priority - a.priority);
	}

	off<K extends keyof Events>(
		event: K,
		listener: (payload: Events[K]) => void,
	): void {
		const handlers = this.listeners[event];
		if (handlers) {
			this.listeners[event] = handlers.filter(
				(entry) => entry.handler !== listener,
			);
			if (this.listeners[event]?.length === 0) {
				delete this.listeners[event];
			}
		}
	}

	emit<K extends keyof Events>(
		event: K,
		...payload: Events[K] extends void ? [] : [Events[K]]
	): void {
		const handlers = this.listeners[event];
		if (handlers) {
			for (const { handler } of handlers) {
				if (payload.length > 0) {
					handler(payload[0]);
				} else {
					(handler as () => void)();
				}
			}
		}
	}

	registerSubscriber<T>(instance: T) {
		const proto = instance as Idk<Record<string, unknown>>;
		const subscriptions: Subscription<Events>[] = proto.__subscriptions;
		if (subscriptions) {
			for (const sub of subscriptions) {
				const handler = (instance as any)[sub.method].bind(instance);
				const inst = instance as Idk<Events>;
				inst.__handlers ??= [];
				inst.__handlers.push({
					event: sub.event,
					handler,
				});
				this.on(
					sub.event as keyof Events,
					handler,
					sub.priority ?? Priority.NORMAL,
				);
			}
		}
	}

	public unregisterSubscriber<T>(instance: T) {
		const inst = instance as Idk<Events>;
		const handlers = inst.__handlers;
		if (handlers) {
			for (const { event, handler } of handlers) {
				this.off(event as keyof Events, handler);
			}
			inst.__handlers = [];
		}
	}
}

export interface Subscription<E> {
	event: keyof E;
	method: string;
	priority?: number;
};

export function Subscribe<K extends keyof ClientEvents>(
	event: K,
	priority: number = Priority.NORMAL,
) {
	return <A extends ClientEvents[K]>(
		_target: unknown,
		mdc: ClassMethodDecoratorContext<
			unknown,
			A extends void ? () => void : (e: A) => void
		> & { name: string },
	) => {
		mdc.addInitializer(function () {
			const t = this as Idk<Record<string, unknown>>;
			t.__subscriptions ??= [];
			const subscriptions: Subscription<ClientEvents>[] = t.__subscriptions;
			subscriptions.push({ event, method: mdc.name, priority });
		});
	};
}
