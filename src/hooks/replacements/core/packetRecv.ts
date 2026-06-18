import { Shift, type SingleReplacement } from "@/hooks/replacementTypes";
import { EXPOSED } from "@/utils/helpers/patchHelper";

// ClientDecoder#add
export const PACKET_RECV_HOOK: SingleReplacement = [
	/*js*/ `w.typeName==="ClientBoundCombined")M.packets.forEach(P=>{const N={type:PacketType$1.EVENT,nsp:"/",data:[P.packet.case,P.packet.value]};ClientSocket.netSim.schedule(()=>this.emit("decoded",N))});else{const P={type:PacketType$1.EVENT,nsp:"/",data:[w.typeName,M]};ClientSocket.netSim.schedule(()=>this.emit("decoded",P))}`,
	{
		replacement: /*js*/ `
w.typeName === "ClientBoundCombined")
	M.packets.forEach(k => {
		const E = {
			type: PacketType$1.EVENT,
			nsp: "/",
			data: [k.packet.case, k.packet.value]
		};
		const cWrap = ${EXPOSED}.newCancelableWrapper(k.packet.value);
		${EXPOSED}.emitEvent("receivePacket", cWrap);
		if (!cWrap.canceled)
			ClientSocket.netSim.schedule( () => this.emit("decoded", E))
	}
	);
else {
	const k = {
		type: PacketType$1.EVENT,
		nsp: "/",
		data: [w.typeName, M]
	};
	const cWrap = ${EXPOSED}.newCancelableWrapper(M);
	${EXPOSED}.emitEvent("receivePacket", cWrap);
	if (!cWrap.canceled)
		ClientSocket.netSim.schedule( () => this.emit("decoded", k))
}`,
		shift: Shift.REPLACE,
	},
];
