/**
 * contains a cache to packet references.
 * @module
 */
import Interop from "../../exposedO";
import type {
	CPACKET_MAP,
	SPACKET_MAP,
} from "../../features/sdk/types/packets";

export type CPacketMap = typeof CPACKET_MAP;
export type SPacketMap = typeof SPACKET_MAP;
export type AnyPacketMap = CPacketMap & SPacketMap;

/** todo: supporting abbreviated names? i.e. PacketRefs.s.SPacketSomething -> PacketRefs.s.Something */
function makeProxyRef<T extends CPacketMap | SPacketMap, V = T[keyof T]>(
	obj: T,
	getUncached: (k: string | symbol) => V,
) {
	return new Proxy<T>(obj, {
		get(target, v) {
			const orig = Reflect.get(target, v) as V;
			let r = orig;
			if (!orig) {
				r = getUncached(v);
				Reflect.set(target, v, r);
			}
			return r;
		},
	});
}

function getC2SUncached<
	K extends keyof SPacketMap,
	V extends SPacketMap[K] = SPacketMap[K],
>(ref: K): V {
	if (typeof ref === "symbol") {
		throw "can't get a c2s packet with a name that is a symbol instead of a string.";
	}
	return Interop.run((evl) => {
		const pkt = evl<V>(ref);
		PacketRefs.c[ref as string] = pkt;
		return pkt;
	});
}

function getS2CUncached<
	K extends keyof CPacketMap,
	V extends CPacketMap[K] = CPacketMap[K],
>(ref: K): V {
	if (typeof ref === "symbol") {
		throw "can't get a c2s packet with a name that is a symbol instead of a string.";
	}
	return Interop.run((evl) => {
		const pkt = evl<V>(ref);
		PacketRefs.c[ref] = pkt;
		return pkt;
	});
}

/**
 * note: use `PacketRefs.c` instead when trying to do `new {packet}`, it's way cleaner since instead of:
 * ```ts
 * const pkt = new (c2s("SPacketSomething"));
 * ```
 * you can do
 * ```ts
 * const pkt = new PacketRefs.s.SPacketSomething;
 * ```
 */
export function c2s<
	K extends keyof SPacketMap,
	V extends SPacketMap[K] = SPacketMap[K],
>(ref: K): V {
	return PacketRefs.s[ref as string] as V;
}

/**
 * note: use `PacketRefs.s` instead when trying to do `new {packet}`, it's way cleaner since instead of:
 * ```ts
 * const pkt = new (s2c("CPacketSomething"));
 * ```
 * you can do
 * ```ts
 * const pkt = new PacketRefs.c.CPacketSomething;
 * ```
 */
export function s2c<
	K extends keyof CPacketMap,
	V extends CPacketMap[K] = CPacketMap[K],
>(ref: K): V {
	return PacketRefs.c[ref] as V;
}

const PacketRefs = {
	/** Client -> Server packets */
	c: makeProxyRef({} as CPacketMap, getC2SUncached),
	/** Server -> Client packets */
	s: makeProxyRef({} as SPacketMap, getS2CUncached),
};

export default PacketRefs;
