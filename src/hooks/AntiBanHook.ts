import Bus from "@/Bus";
import ModuleManager from "@/features/modules/api/ModuleManager";
import { isC2S } from "@/utils";

function hook() {
	Bus.on("connect", () => {
		Bus.onceB("sendPacket", ({ data: pkt }) => {
			if (isC2S("SPacketLoginStart", pkt)) {
				console.info("hello world");
				pkt.hydration = "0";
				pkt.prefetch = undefined;
				pkt.metricsId = crypto.randomUUID();
				if (ModuleManager.antiBan.enabled) {
					const na = ModuleManager.antiBan.handleNonAccount();
					pkt.session = na.session;
					if (na.requestedUuid) pkt.requestedUuid = na.requestedUuid;
				}
			}
			return false;
		});
	});
}

hook();
