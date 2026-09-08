import { AnyPacket, origSendReliable } from "@/hooks/packetHook";

export function sendSilently(packet: AnyPacket) {
	return origSendReliable(packet);
}
