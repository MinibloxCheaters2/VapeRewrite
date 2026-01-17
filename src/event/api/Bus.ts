import type ClientEvents from "./Events.ts";

interface Idk<T extends Record<string, unknown>> {
  __handlers: {
    event: PropertyKey;
    handler: (value: unknown) => void;
  }[];
  __subscriptions: Subscription<T>[];
}

export default class EventBus<Events extends Record<string, unknown>> {
  private listeners: Partial<
    { [K in keyof Events]: Array<(payload: Events[K]) => void> }
  > = {};

  on<K extends keyof Events>(
    event: K,
    listener: (payload: Events[K]) => void,
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof Events>(
    event: K,
    listener: (payload: Events[K]) => void,
  ): void {
    const handlers = this.listeners[event];
    if (handlers) {
      this.listeners[event] = handlers.filter((handler) =>
        handler !== listener
      );
      if (this.listeners[event]!.length === 0) {
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
      handlers.forEach((handler) => {
        if (payload.length > 0) {
          handler(payload[0]);
        } else {
          (handler as () => void)();
        }
      });
    }
  }

  registerSubscriber<T>(instance: T) {
    // Access subscriptions from the prototype
    const proto = instance as Idk<Record<string, unknown>>;
    const subscriptions: Subscription<Events>[] = proto.__subscriptions;
    if (subscriptions) {
      for (const sub of subscriptions) {
        const handler = instance[sub.method].bind(instance);
        const inst = instance as Idk<Events>;
        (inst.__handlers || (inst.__handlers = [])).push({
          event: sub.event,
          handler,
        });
        this.on(sub.event as keyof Events, handler);
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
      inst.__handlers = []; // Clear stored handlers
    }
  }
}

export type Subscription<E> = { event: keyof E; method: string };

export function Subscribe<K extends keyof ClientEvents>(
  event: K,
) {
  return function <
    A extends ClientEvents[K]
  >(
    _target: unknown,
    mdc: ClassMethodDecoratorContext<
      unknown,
      A extends void ? () => void : (e: A) => void
    > & { name: string }
  ) {
    mdc.addInitializer(function () {
      const t = this as Idk<Record<string, unknown>>;

      const subscriptions: Subscription<ClientEvents>[] =
        t.__subscriptions ??= [];

      subscriptions.push({ event, method: mdc.name });
    });
  };
}
