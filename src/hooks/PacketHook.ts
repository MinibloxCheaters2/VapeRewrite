import Bus from "@/Bus";
import CancelableWrapper from "@/event/CancelableWrapper";
import { expose } from "@/exposed";
import Refs from "@/utils/helpers/refs";

let Message;
let proto2;
let origToBinary, origFromBinary;

const packetHook = {
	init() {
		const SPacketUpdateInventory =
			Refs.player.inventory.sendInventoryToServer();
		Message = SPacketUpdateInventory.constructor.__proto__;
		expose("Message", () => Message);
		proto2 = SPacketUpdateInventory.constructor.runtime;
		origToBinary = Message.prototype.toBinary;
		origFromBinary = Message.prototype.fromBinary;

		Message.prototype.toBinary = new Proxy(origToBinary, {
			apply(target, thisArg, argArray) {
				const cw = new CancelableWrapper(thisArg);
				Bus.emit("sendPacket", cw);
				if (cw.canceled) return;
				return Reflect.apply(target, thisArg, argArray);
			},
		});

		Message.prototype.fromBinary = new Proxy(origFromBinary, {
			apply(target, thisArg, argArray) {
				const cw = new CancelableWrapper(thisArg);
				Bus.emit("receivePacket", cw);
				if (cw.canceled) return;
				return Reflect.apply(target, thisArg, argArray);
			},
		});
	},
};
packetHook.init();
export default packetHook;
