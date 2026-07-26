/**
 * contains a cache to packet references.
 * @module
 */
import type { CPACKET_MAP, Message, SPACKET_MAP } from "@wq2/miniblox-sdk";
import { discoveredPackets } from "@/hooks/PacketHook";
import Miniblox from "../refs/miniblox";
import { packets as dummyPackets } from "./WasmTest";

export type CPacketMap = typeof CPACKET_MAP;
export type SPacketMap = typeof SPACKET_MAP;
export type CPacketName = keyof CPacketMap;
export type SPacketName = keyof SPacketMap;
export type AnyPacketMap = CPacketMap & SPacketMap;
export type AnyPacketName = keyof AnyPacketMap;

/** todo: supporting abbreviated names? i.e. PacketRefs.s.SPacketSomething -> PacketRefs.s.Something */
function makeProxyRef<T extends CPacketMap | SPacketMap, V = T[keyof T]>(
	obj: T,
	getUncached: (k: keyof T) => V,
) {
	return new Proxy<T>(obj, {
		get(target, v) {
			const orig = Reflect.get(target, v) as V;
			let r = orig;
			if (!orig) {
				r = getUncached(v as keyof T);
				Reflect.set(target, v, r);
			}
			return r;
		},
	});
}

function extractS2CPacketsFromCombined(pktClass: unknown) {
	try {
		const fields = (
			pktClass as {
				fields?: Iterable<{
					name?: string;
					T?: {
						fields?: Iterable<{
							name?: string;
							oneof?: string;
							T?: unknown;
						}>;
					};
					oneof?: string;
				}>;
			}
		).fields;
		if (!fields) return;
		for (const field of fields) {
			if (field.name === "packets" && field.T?.fields) {
				for (const sub of field.T.fields) {
					if (sub.oneof === "packet" && sub.T && sub.name) {
						discoveredPackets.set(sub.name, sub.T as Message<object>);
					}
				}
				break;
			}
		}
	} catch {
		/* noop */
	}
}

function findPacketByName(ref: string) {
	const fromSdk = Miniblox.packets?.find((x) => "typeName" in x && x.typeName === ref);
	const fromDiscovered = discoveredPackets.get(ref);
	const fromDummy = dummyPackets.get(ref);

	const result = fromSdk ?? fromDiscovered ?? fromDummy;

	if (result && (fromSdk || fromDiscovered)) {
		dummyPackets.delete(ref);
	}

	if (result && ref === "ClientBoundCombined") {
		extractS2CPacketsFromCombined(result);
	}

	return result;
}

function getC2SUncached<K extends SPacketName, V extends SPacketMap[K] = SPacketMap[K]>(ref: K): V {
	if (typeof ref === "symbol") {
		throw "can't get a c2s packet with a name that is a symbol instead of a string.";
	}
	const result = findPacketByName(ref as string);
	if (!result) throw `failed to find packet named ${ref}`;
	return result as V;
}

function getS2CUncached<K extends keyof CPacketMap, V extends CPacketMap[K] = CPacketMap[K]>(
	ref: K,
): V {
	if (typeof ref === "symbol") {
		throw "can't get a s2c packet with a name that is a symbol instead of a string.";
	}
	const result = findPacketByName(ref as string);
	if (!result) throw `failed to find packet named ${ref}`;
	return result as V;
}

/**
 * note: use `PacketRefs.c` instead when trying to do `new {packet}`, it's way cleaner since instead of:
 * ```ts
 * const pkt = new (s2c("CPacketSomething"));
 * ```
 * you can do
 * ```ts
 * const pkt = new PacketRefs.s.SPacketSomething;
 * ```
 */
export function c2s<K extends keyof SPacketMap, V extends SPacketMap[K] = SPacketMap[K]>(
	ref: K,
): V {
	return PacketRefs.s[ref] as V;
}

/**
 * note: use `PacketRefs.s` instead when trying to do `new {packet}`, it's way cleaner since instead of:
 * ```ts
 * const pkt = new (c2s("SPacketSomething"));
 * ```
 * you can do
 * ```ts
 * const pkt = new PacketRefs.c.CPacketSomething;
 * ```
 */
export function s2c<K extends keyof CPacketMap, V extends CPacketMap[K] = CPacketMap[K]>(
	ref: K,
): V {
	return PacketRefs.c[ref] as V;
}

const PacketRefs = {
	/** Client -> Server packets */
	s: makeProxyRef({} as SPacketMap, getC2SUncached),
	/** Server -> Client packets */
	c: makeProxyRef({} as CPacketMap, getS2CUncached),
};

export default PacketRefs;
