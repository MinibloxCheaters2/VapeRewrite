import { Shift, type SingleReplacement } from "@/hooks/replacementTypes";
import { EXPOSED } from "@/utils/patchHelper";

export default [
	"new SPacketLoginStart({" +
		"requestedUuid:localStorage.getItem(REQUESTED_UUID_KEY)??void 0," +
		'session:localStorage.getItem(SESSION_TOKEN_KEY)??"",' +
		'hydration:localStorage.getItem("hydration")??"0",' +
		'metricsId:localStorage.getItem("metrics_id")??"",' +
		"clientVersion:VERSION$1" +
		"})",
	{
		replacement: `new SPacketLoginStart({
  requestedUuid: undefined,
  session: (${EXPOSED}.moduleManager.antiBan.enabled
    ? await ${EXPOSED}.moduleManager.antiBan.getToken()
    : (localStorage.getItem(SESSION_TOKEN_KEY) ?? "")),
  hydration: "0",
  metricsId: uuid$1(),
  clientVersion: VERSION$1
  })`,
		shift: Shift.REPLACE,
	},
] satisfies SingleReplacement;
