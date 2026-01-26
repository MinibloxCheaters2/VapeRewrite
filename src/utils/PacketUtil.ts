import type { C2SPacket } from "../features/sdk/types/packetTypes"
import Refs from "./refs";

export default {
	send(pkt: C2SPacket) {
		Refs.ClientSocket.sendPacket(pkt);
	},
	// normal body of ClientSocket.sendPacket
	sendSilently(pkt: C2SPacket) {
		if (!Refs.ClientSocket.socket) {
			return;
		}
		const typeName = (pkt.constructor as Function & { typeName: string }).typeName;
		// TODO: Refs.ClientSocket.socket.send might also work?
		Refs.ClientSocket.socket.emit(typeName, pkt);
	}
};
