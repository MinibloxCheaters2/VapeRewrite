import { Shift, type SingleReplacement } from "@/hooks/replacementTypes";
import { EXPOSED } from "@/utils/patchHelper";

// ClientDecoder#add
export const PACKET_RECV_HOOK: SingleReplacement = [
	/*js*/ `if(v.typeName==="ClientBoundCombined")w.packets.forEach(k=>{const E={type:PacketType$1.EVENT,nsp:"/",data:[k.packet.case,k.packet.value]};ClientSocket.netSim.schedule(()=>this.emit("decoded",E))});else{const k={type:PacketType$1.EVENT,nsp:"/",data:[v.typeName,w]};ClientSocket.netSim.schedule(()=>this.emit("decoded",k))}`,
	{
		replacement: /*js*/ `
if (v.typeName === "ClientBoundCombined")
	w.packets.forEach(k => {
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
		data: [v.typeName, w]
	};
	const cWrap = ${EXPOSED}.newCancelableWrapper(k.packet.value);
	${EXPOSED}.emitEvent("receivePacket", cWrap);
		if (!cWrap.canceled)
	ClientSocket.netSim.schedule( () => this.emit("decoded", k))
}`,
		shift: Shift.REPLACE,
	},
];
