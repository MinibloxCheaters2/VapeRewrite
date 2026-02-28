import type {
    SPacketPlayerInput,
    SPacketPlayerPosLook,
} from "@/features/sdk/types/packets";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import { c2s } from "./packetRefs";
import { SimpleVec3 } from "../math/vec";

export default function getPosFromPacket(
    packet: SPacketPlayerPosLook,
): SimpleVec3 | undefined; // doesn't always have the position in it
export default function getPosFromPacket(
    packet: SPacketPlayerInput,
): SimpleVec3; // not optional
export default function getPosFromPacket(
    packet: C2SPacket,
): SimpleVec3 | undefined;
export default function getPosFromPacket(
    packet: C2SPacket,
): SimpleVec3 | undefined {
    if (packet instanceof c2s("SPacketPlayerPosLook") && packet.pos) {
        return SimpleVec3.fromFloatVec3(packet.pos);
    }
    if (packet instanceof c2s("SPacketPlayerInput")) {
        return SimpleVec3.fromFloatVec3(packet.pos);
    }
}
