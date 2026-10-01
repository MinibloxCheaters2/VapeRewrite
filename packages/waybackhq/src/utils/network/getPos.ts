import { AnyPacket } from "@/hooks/packetHook";
import { mod } from "../wrappers/protocol";
import { SimpleVec3 } from "@vape/core/utils/math/vec";

export default function getPosFromPacket(packet: AnyPacket) {
	const [id] = packet;
	if (id !== mod.PACKET.INPUT) return undefined;
	const [, x, y, z] = packet as [number, number, number, number];
	return new SimpleVec3(x, y, z);
}
