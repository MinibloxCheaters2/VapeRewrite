import Bus from "@/Bus";
import CancelableWrapper from "@/event/CancelableWrapper";
import { expose } from "@/exposed";
import Miniblox from "@/utils/refs/miniblox";
import { waitForReact } from "@/utils/helpers/waitForReact";
import { ClientSocket, Message } from "@wq2/miniblox-sdk";

let _Message: Message<object> & {
	prototype: {
		toBinary: () => Uint8Array;
		fromBinary: (binary: Uint8Array) => Message<object>;
	};
};
let proto2;
let /*origToBinary, */ origFromBinary;
let origSend;

const packetHook = {
	init() {
		origSend = ClientSocket.sendPacket;
		ClientSocket.sendPacket = new Proxy(origSend, {
			apply(target, thisArg, argArray) {
				const cw = new CancelableWrapper(argArray);
				Bus.emit("sendPacket", cw);
				if (cw.canceled) return;
				return Reflect.apply(target, thisArg, cw.data);
			},
		});
		const SPacketUpdateInventory =
			Miniblox.player.inventory.sendInventoryToServer();
		_Message = SPacketUpdateInventory.constructor.__proto__;
		expose("Message", () => _Message);
		proto2 = SPacketUpdateInventory.constructor.runtime;
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
			apply(target, thisArg, argArray) {
				const cw = new CancelableWrapper(thisArg);
				Bus.emit("receivePacket", cw);
				if (cw.canceled) return;
				return Reflect.apply(target, thisArg, argArray);
			},
		});
	},
};
waitForReact().then(() => packetHook.init());
export default packetHook;
