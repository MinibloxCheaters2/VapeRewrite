import type { ClientSocket as ClientSocketT, Message } from "@wq2/miniblox-sdk";
import Bus from "@/Bus";
import CancelableWrapper from "@/event/CancelableWrapper";
import { expose } from "@/exposed";
import { waitForReact } from "@/utils/helpers/waitForReact";
import Miniblox from "@/utils/refs/miniblox";

let _Message: Message<object> & {
	prototype: {
		toBinary: () => Uint8Array;
		fromBinary: (binary: Uint8Array) => Message<object>;
	};
};
let _proto2: object;
let /*origToBinary, */ origFromBinary: (binary: Uint8Array) => Message<object>;
let origSend: (typeof ClientSocketT)["sendPacket"];

const packetHook = {
	init() {
		origSend = Miniblox.ClientSocket.sendPacket;
		Miniblox.ClientSocket.sendPacket = new Proxy(origSend, {
			apply(target, thisArg, argArray) {
				const cw = new CancelableWrapper(argArray[0]);
				Bus.emit("sendPacket", cw);
				if (cw.canceled) return;
				return Reflect.apply(target, thisArg, [cw.data]);
			},
		});
		const SPacketUpdateInventory =
			Miniblox.player.inventory.sendInventoryToServer();
		_Message = Object.getPrototypeOf(SPacketUpdateInventory.constructor);
		expose("Message", () => _Message);
		_proto2 = SPacketUpdateInventory.constructor.runtime;
		origFromBinary = _Message.prototype.fromBinary;

		/*Message.prototype.toBinary = new Proxy(origToBinary, {
			apply(target, thisArg, argArray) {
				const cw = new CancelableWrapper(thisArg);
				Bus.emit("sendPacket", cw);
				if (cw.canceled) return;
				return Reflect.apply(target, thisArg, argArray);
			},
			});*/

		_Message.prototype.fromBinary = new Proxy(origFromBinary, {
			apply(target, thisArg, _argArray) {
				const cw = new CancelableWrapper(thisArg);
				Bus.emit("receivePacket", cw);
				if (cw.canceled) return;
				return Reflect.apply(target, thisArg, cw.data);
			},
		});
	},
};
waitForReact().then(() => packetHook.init());
export default packetHook;
