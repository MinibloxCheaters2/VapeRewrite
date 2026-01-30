import Interop from "../exposedO";
import type { CPACKET_MAP, SPACKET_MAP } from "../features/sdk/types/packets";

type PacketMap = typeof CPACKET_MAP & typeof SPACKET_MAP;

const PacketRefs = {
	refs: {} as PacketMap,

	getRef<K extends keyof PacketMap, V extends PacketMap[K] = PacketMap[K]>(
		rf: K,
	): V {
		if (PacketRefs.refs[rf] === undefined) {
			return Interop.run((evl) => {
				const pkt = evl<V>(rf);
				PacketRefs.refs[rf] = pkt;
				return pkt;
			});
		}
		return PacketRefs.refs[rf] as V;
	},
};

export default PacketRefs;
