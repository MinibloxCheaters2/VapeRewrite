import type { C2SPacket } from "@wq2/miniblox-sdk";
import Miniblox from "../refs/miniblox";
import type { CPacketMap, SPacketMap } from "./packetRefs";
import { S2CData } from "@/event/Events";

export function isC2S<const K extends keyof SPacketMap>(
	name: K,
	pkt: unknown,
): pkt is InstanceType<SPacketMap[K]> {
	return (
		(
			pkt as typeof pkt & {
				constructor: { typeName: K };
			}
		)?.constructor?.typeName === name
	);
}

export function isS2C<const K extends keyof CPacketMap>(
	name: K,
	pkt: unknown,
): pkt is InstanceType<CPacketMap[K]> {
	return (
		(pkt instanceof S2CData && pkt.name === name) ||
		(
			pkt as typeof pkt & {
				constructor: { typeName: K };
			}
		)?.constructor?.typeName === name
	);
}

export function send(pkt: C2SPacket) {
	Miniblox.ClientSocket.sendPacket(pkt);
}
export function sendSilently(pkt: C2SPacket) {
	// normal body of ClientSocket.sendPacket
	if (!Miniblox.ClientSocket.socket) {
		return;
	}
	const typeName = (pkt.constructor as ((a: object) => unknown) & { typeName: string }).typeName;
	// TODO: Miniblox.ClientSocket.socket.send might also work?
	Miniblox.ClientSocket.socket.emit(typeName, pkt);
}
