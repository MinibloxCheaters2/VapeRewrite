import { LOG_REMAPPING } from "@/debugControls";
import logger from "../logging/loggers";

export type Mapping = Record<string | symbol, string | symbol>;

// https://grok.com/share/bGVnYWN5LWNvcHk%3D_6bb5b2ee-ec03-4093-ae7f-7dd3fbf17998

export function reverseMapping(mapping: Mapping) {
    return Object.fromEntries(
        Object.entries(mapping).map(([obf, orig]) => [orig, obf]),
    );
}

function remapAction<K extends keyof Mapping, A extends unknown[], R>(
    name: K,
    fn: (...args: A) => R,
    reverseMapping: Mapping,
    argProvider: (realKey: PropertyKey) => A,
): R {
    const mapped = name in reverseMapping;
    const realKey = mapped ? reverseMapping[name] : name;

    if (LOG_REMAPPING && mapped) {
        logger.debug(
            `[REMAP PROXY] (${fn.name}) remap ${name.toString()} -> ${realKey.toString()}`,
        );
    }

    return fn(...argProvider(realKey));
}

/**
 * @param obj the object to proxy
 * @param mapping mappings for this object (obfuscated -> original)
 * @param reverseMapping reversed mappings for this object (original -> obfuscated)
 * @returns
 */
export default function remapObj<T extends object>(
    obj: T,
    mapping: Mapping,
    reverseMapping: Mapping = Object.fromEntries(
        Object.entries(mapping).map(([obf, orig]) => [orig, obf]),
    ),
) {
    return new Proxy(obj, {
        get(target: T, prop: PropertyKey, receiver: unknown) {
            if (typeof prop === "number") {
                return Reflect.get(target, prop, receiver);
            }
            return remapAction(prop, Reflect.get, reverseMapping, (k) => [
                target,
                k,
                receiver,
            ] as const);
        },

        set(
            target: T,
            prop: PropertyKey,
            value: unknown,
            receiver: unknown,
        ): boolean {
            if (typeof prop === "number") {
                return Reflect.set(target, prop, value, receiver);
            }
            return remapAction(prop, Reflect.set, reverseMapping, (k) => [
                target,
                k,
                value,
                receiver,
            ] as const);
        },

        deleteProperty(target: T, p: PropertyKey): boolean {
            if (typeof p === "number") {
                return Reflect.deleteProperty(target, p);
            }
            return remapAction(
                p,
                Reflect.deleteProperty,
                reverseMapping,
                (k) => [target, k] as const,
            );
        },

        has(target: T, prop: PropertyKey): boolean {
            if (typeof prop === "number") {
                return Reflect.has(target, prop);
            }
            return remapAction(
                prop,
                Reflect.has,
                reverseMapping,
                (k) => [target, k] as const,
            );
        },

        ownKeys(target: T): (string | symbol)[] {
            const keys = Reflect.ownKeys(target);
            return keys.map((k) => mapping[k] ?? k);
        },

        getOwnPropertyDescriptor(
            target: T,
            prop: PropertyKey,
        ): PropertyDescriptor | undefined {
            // We still need a small runtime check here because not every prop is in reverseMapping
            if (prop in reverseMapping) {
                const realKey = reverseMapping[prop];
                const desc = Reflect.getOwnPropertyDescriptor(target, realKey);
                if (desc) {
                    // Mutable descriptor to avoid frozen object issues
                    const rewritten: PropertyDescriptor = {
                        ...desc,
                        // Only matters for functions — but harmless otherwise
                        ...(desc.get || desc.set || typeof desc.value === "function"
                            ? { name: prop }
                            : {}),
                    };
                    return rewritten;
                }
                return desc;
            }
            return Reflect.getOwnPropertyDescriptor(target, prop);
        },
    }) as T;
}
