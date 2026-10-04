import Miniblox from "@/utils/refs/miniblox";
import { showNotification } from "@vape/core/ui/notifications";

import Bus from "@/Bus";
import { isC2S } from "@/utils";
import AntiBan from "@/features/modules/impl/utility/AntiBan";

function hook() {
	Bus.on("connect", () => {
		Bus.onceB("sendPacket", ({ data: pkt }) => {
			if (isC2S("SPacketLoginStart", pkt)) {
				pkt.hydration = "0";
				(pkt as typeof pkt & { prefetch?: unknown }).prefetch = undefined;
				pkt.metricsId = crypto.randomUUID();
				const antiBan = AntiBan.INSTANCE;
				if (antiBan.enabled) {
					const na = antiBan.handleNonAccount();
					pkt.session = na.session;
					// legacy non-accounts don't have requestedUUID as a name
					pkt.requestedUuid = na.requestedUuid;
				} else {
					setTimeout(() => {
						const {player} = Miniblox;
						if (!player) return;
						if (player.name.startsWith("Ennocent")) {
							showNotification("Vape Rewrite", "Enable AntiBan or GAY", "alert", 1.5e3);
						}
					}, 3e3);
				}
			}
			return false;
		});
	});
}

hook();
