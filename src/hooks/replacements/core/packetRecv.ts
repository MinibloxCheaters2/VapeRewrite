import { Shift, SingleReplacement } from "@/hooks/replacementTypes";
import { EXPOSED } from "@/utils/patchHelper";

// ClientDecoder#add
export const PACKET_RECV_HOOK: SingleReplacement = [
	`v.typeName==="ClientBoundCombined"?w.packets.forEach(k=>{this.emit("decoded",{type:PacketType$1.EVENT,nsp:"/",data:[k.packet.case,k.packet.value]})}):this.emit("decoded",{type:PacketType$1.EVENT,nsp:"/",data:[v.typeName,w]})`,
	{
		replacement: `
if (v.typeName === "ClientBoundCombined") {
	w.packets.forEach(k => {
		const cWrap = ${EXPOSED}.newCancelableWrapper(k.packet.value);
		${EXPOSED}.emitEvent("receivePacket", cWrap);
		if (!cWrap.canceled)
			this.emit("decoded", {
				type: PacketType$1.EVENT,
				nsp: "/",
				data: [k.packet.case, k.packet.value]
			});
	});
} else {
	const cWrap = ${EXPOSED}.newCancelableWrapper(w);
	${EXPOSED}.emitEvent("receivePacket", cWrap);
	if (!cWrap.canceled)
		this.emit("decoded", {
			type: PacketType$1.EVENT,
			nsp: "/",
			data: [v.typeName, w]
		});
}
`,
	shift: Shift.REPLACE
	}
];
