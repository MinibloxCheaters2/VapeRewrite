import type { Connection } from "@wq2/waybackhq-types/src/net/connection";

import CancelableWrapper from "@vape/core/event/CancelableWrapper";
import { PACKET } from "@wq2/waybackhq-types/src/net/protocol";

import Bus from "@/Bus";

const connectionPromise = import("@wq2/waybackhq-types/src/net/connection").then(
	(x) => x.Connection,
);

export type Packet = typeof PACKET;
export type PacketName = keyof Packet;
export type PacketID = Packet[PacketName];
export type AnyPacket = [ID: PacketID, ...unknown[]];

export async function hookSendPacket() {
	const connection = await connectionPromise;
	// sendFast is just an alias to sendReliable, I don't need to hook that.
	connection.prototype.sendReliable = new Proxy(connection.prototype.sendReliable, {
		apply(target, thisArg: Connection, argArray: [AnyPacket]) {
			function callOrig(data = [wrap.data]) {
				Reflect.apply(target, thisArg, data);
			}
			if (!thisArg.connected) return callOrig(argArray);
			const wrap = new CancelableWrapper(argArray[0]);
			Bus.emit("sendPacket", wrap);
			if (wrap.canceled) return;
			return callOrig();
		},
	});
}

export async function hookReceivePacket() {
	const connection = await connectionPromise;
	connection.prototype.handleMessage = new Proxy(connection.prototype.handleMessage, {
		apply(target, thisArg: Connection, argArray: [string]) {
			let packet: AnyPacket;
			try {
				packet = JSON.parse(argArray[0]);
			} catch (error) {
				return;
			}
			if (!Array.isArray(packet)) {
				return;
			}
			const wrap = new CancelableWrapper(packet);
			Bus.emit("receivePacket", wrap);
			if (wrap.canceled) return;
			return Reflect.apply(target, thisArg, [JSON.stringify(wrap.data)]);
		},
	});
}

export default async function hookConnection() {
	await Promise.all([hookSendPacket(), hookReceivePacket()]);
}

hookConnection();
