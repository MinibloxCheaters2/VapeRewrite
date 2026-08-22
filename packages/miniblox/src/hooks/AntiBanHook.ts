import ModuleManager from "@vape/core/features/modules/api/ModuleManager";

import Bus from "@/Bus";
import { isC2S } from "@/utils";

function hook() {
	Bus.on("connect", () => {
		Bus.onceB("sendPacket", ({ data: pkt }) => {
			if (isC2S("SPacketLoginStart", pkt)) {
				pkt.hydration = "0";
				pkt.prefetch = undefined;
				pkt.metricsId = crypto.randomUUID();
				if (ModuleManager.antiBan.enabled) {
					const na = ModuleManager.antiBan.handleNonAccount();
					pkt.session = na.session;
					// legacy non-accounts don't have requestedUUID as a name
					pkt.requestedUuid = na.requestedUuid;
				}
			}
			return false;
		});
	});
}

hook();
