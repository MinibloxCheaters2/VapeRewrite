import Bus from "@/Bus";

function hook() {
	Bus.on("connect", () => {
		Bus.onceB("sendPacket", ({ data: pkt }) => {
			console.log(pkt);
			return false;
		});
	});
}

hook();
