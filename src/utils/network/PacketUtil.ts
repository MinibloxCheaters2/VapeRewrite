import type { C2SPacket } from "@wq2/miniblox-sdk";
import Miniblox from "../refs/miniblox";

export default {
	send(pkt: C2SPacket) {
		Miniblox.ClientSocket.sendPacket(pkt);
	},
	// normal body of ClientSocket.sendPacket
	sendSilently(pkt: C2SPacket) {
		if (!Miniblox.ClientSocket.socket) {
			return;
		}
		const typeName = (
			pkt.constructor as ((a: object) => unknown) & { typeName: string }
		).typeName;
		// TODO: Miniblox.ClientSocket.socket.send might also work?
		Miniblox.ClientSocket.socket.emit(typeName, pkt);
	},
};
