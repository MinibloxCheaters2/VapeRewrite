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
export type AnyPacket = [PacketID, ...unknown[]];

export default async function hookConnection() {
	const connection = await connectionPromise;
	// sendFast is just an alias to sendReliable, I don't need to hook that.
	connection.prototype.sendReliable = new Proxy(connection.prototype.sendReliable, {
		apply(target, thisArg: Connection, argArray: [AnyPacket]) {
			const wrap = new CancelableWrapper(argArray[0]);
			Bus.emit("sendPacket", wrap);
			if (wrap.canceled) return;
			return Reflect.apply(target, thisArg, wrap.data);
		},
	});
	connection.prototype.handleMessage = new Proxy(connection.prototype.handleMessage, {
		apply(target, thisArg: Connection, argArray: [string]) {
			console.log(argArray);
			let packet: AnyPacket;
			try {
				packet = JSON.parse(argArray[0]);
			} catch (error) {
				void error;
				return;
			}
			if (!Array.isArray(packet)) {
				return;
			}
			const wrap = new CancelableWrapper(packet);
			Bus.emit("receivePacket", wrap);
			if (wrap.canceled) return;
			return Reflect.apply(target, thisArg, wrap.data);
		},
	});
}

hookConnection();
