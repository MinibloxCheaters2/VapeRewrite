import type { ClientSocket as ClientSocketT, Message } from "@wq2/miniblox-sdk";
import Bus from "@/Bus";
import CancelableWrapper from "@/event/CancelableWrapper";
// import { expose } from "@/exposed";
import { MAIN_LOGGER as logger } from "@/utils";
import { waitForReact } from "@/utils/helpers/waitForReact";
import Miniblox from "@/utils/refs/miniblox";

let _Message: Message<object> & {
	prototype: {
		toBinary: () => Uint8Array;
		fromBinary: (binary: Uint8Array) => Message<object>;
	};
};
// let _proto2: object;
// let origToBinary, origFromBinary: (binary: Uint8Array) => Message<object>;
let origSend: (typeof ClientSocketT)["sendPacket"];

export const discoveredPackets = new Map<string, Message<object>>();

function hookSendPacket() {
	const cs = Miniblox.ClientSocket;
	if (!cs) {
		logger.warn("No ClientSocket! can't hook send packet");
		return;
	}
	origSend = cs.sendPacket;
	cs.sendPacket = new Proxy(origSend, {
		apply(target, thisArg, argArray) {
			const cw = new CancelableWrapper(argArray.splice(0, 1)[0]);
			Bus.emit("sendPacket", cw);
			if (cw.canceled) return;
			const packet = cw.data;
			if (packet && typeof packet === "object") {
				const ctor = (
					packet as {
						constructor: Message<object> & {
							typeName?: string;
						};
					}
				).constructor;
				if ("typeName" in ctor && typeof ctor.typeName === "string") {
					const name = ctor.typeName;
					if (name && !Miniblox.packets?.some((x) => "typeName" in x && x.typeName === name)) {
						discoveredPackets.set(name, ctor);
					}
				}
			}
			return Reflect.apply(target, thisArg, [cw.data, ...argArray]);
		},
	});
}

declare class Encoder {
	encode(packet: unknown): (string | ArrayBufferLike)[];
}

declare class Decoder {
	/**
	 * Receive a chunk (string or buffer) and optionally emit a "decoded" event with the reconstructed packet
	 */
	add(chunk: unknown): void;
	/**
	 * Emits an event.
	 *
	 * @param ev Name of the event
	 * @param args Values to send to listeners of this event
	 */
	emit<Ev extends string>(
		ev: Ev,
		...args: [
			| {
					type: 2 | number;
					nsp: "/";
					data: [string, object];
			  }
			| object,
		]
	): this;
}

let origEmit: Decoder["emit"];

/**
 * exported because connect hook needs to run ts
 */
function hookReceivePacket() {
	/*
	const SPacketUpdateInventory =
		Miniblox.player.inventory.sendInventoryToServer();
	_Message = Object.getPrototypeOf(SPacketUpdateInventory.constructor);
	expose("Message", () => _Message);
	_proto2 = getMsgRuntime(SPacketUpdateInventory);
	origFromBinary = _Message.prototype.fromBinary;
	_Message.prototype.fromBinary = new Proxy(origFromBinary, {
		apply(target, thisArg, argArray) {
			const cw = new CancelableWrapper(thisArg);
			Bus.emit("receivePacket", cw);
			if (cw.canceled) return;
			return Reflect.apply(target, cw.data, argArray);
		},
	});*/
	const cs = Miniblox.ClientSocket;
	if (!cs) {
		logger.warn("Can't hook receive packet without a ClientSocket reference");
		return;
	}
	const parser = cs.socket.io.opts.parser as {
		protocol: 5;
		Encoder: typeof Encoder;
		Decoder: typeof Decoder;
	};
	origEmit = parser.Decoder.prototype.emit;
	parser.Decoder.prototype.emit = new Proxy(origEmit, {
		apply(target, thisArg, argArray) {
			const [, { type, nsp, data }] = argArray[0] as [
				string,
				{
					type: 2 | number;
					nsp: "/";
					data: object | [string, object];
				},
			];
			if (
				type === 2 &&
				// biome-ignore lint/suspicious/useIsArray: don't downcast my array :(
				data instanceof Array &&
				typeof data[0] === "string"
			) {
				argArray.splice(1);
				const cw = new CancelableWrapper((data as [string, object])[1]);
				Bus.emit("receivePacket", cw);
				data[1] = cw.data;
				return Reflect.apply(target, thisArg, [
					argArray[0],
					{
						type,
						nsp,
						data,
					},
					...argArray,
				]);
			}

			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

const packetHook = {
	init() {
		hookSendPacket();
		hookReceivePacket();
	},
};
waitForReact().then(() => packetHook.init());
export default packetHook;
