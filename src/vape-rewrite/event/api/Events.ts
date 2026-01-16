import { C2SPacket, S2CPacket } from "../../features/sdk/types/packetTypes";
import CancelableWrapper from "./CancelableWrapper";

interface ClientEvents {
  tick: void;
  render: void;
  sendPacket: CancelableWrapper<C2SPacket>;
  // TODO: should it be possible to cancel S2C packets?
  receivePacket: S2CPacket;
};

export default ClientEvents;
