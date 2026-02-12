import Interop from "../exposedO";
import type { CPACKET_MAP, SPACKET_MAP } from "../features/sdk/types/packets";

export type CPacketMap = typeof CPACKET_MAP;
export type SPacketMap = typeof SPACKET_MAP;
export type AnyPacketMap = CPacketMap & SPacketMap;

const PacketRefs = {
	cRefs: {} as CPacketMap,
	sRefs: {} as SPacketMap,
};

export function c2s<
	K extends keyof SPacketMap,
	V extends SPacketMap[K] = SPacketMap[K],
>(ref: K): V {
	if (PacketRefs.sRefs[ref] === undefined) {
		return Interop.run((evl) => {
			const pkt = evl<V>(ref as string);
			PacketRefs.cRefs[ref as string] = pkt;
			return pkt;
		});
	}
	return PacketRefs.cRefs[ref as string] as V;
}

export function s2c<
	K extends keyof CPacketMap,
	V extends CPacketMap[K] = CPacketMap[K],
>(ref: K): V {
	if (PacketRefs.cRefs[ref] === undefined) {
		return Interop.run((evl) => {
			const pkt = evl<V>(ref as string);
			PacketRefs.cRefs[ref] = pkt;
			return pkt;
		});
	}
	return PacketRefs.cRefs[ref] as V;
}
