import type { CPacketMap, SPacketMap } from "./packetRefs";
import type { C2SPacket, S2CPacket } from "@wq2/miniblox-sdk";

import { S2CData } from "@/event/Events";

import Miniblox from "../refs/miniblox";

export function isC2S<const K extends keyof SPacketMap>(
	name: K,
	pkt: unknown,
): pkt is InstanceType<SPacketMap[K]>;
export function isC2S(name: string, pkt: unknown): pkt is C2SPacket;
export function isC2S<const K extends keyof SPacketMap>(
	name: K | string,
	pkt: unknown,
): pkt is InstanceType<SPacketMap[K]> | C2SPacket {
	return (
		(
			pkt as typeof pkt & {
				constructor: { typeName: K | string };
			}
		)?.constructor?.typeName === name
	);
}

export function isS2C<const K extends keyof CPacketMap>(
	name: K,
	pkt: unknown,
): pkt is InstanceType<CPacketMap[K]>;
export function isS2C(name: string, pkt: unknown): pkt is S2CPacket;
export function isS2C<const K extends keyof CPacketMap>(
	name: K | string,
	pkt: unknown,
): pkt is InstanceType<CPacketMap[K]> | S2CPacket {
	return (
		(pkt instanceof S2CData && pkt.name === name) ||
		(
			pkt as typeof pkt & {
				constructor: { typeName: K | string };
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
