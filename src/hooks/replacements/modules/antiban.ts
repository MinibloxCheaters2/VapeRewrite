import { Shift, type SingleReplacement } from "@/hooks/replacementTypes";
import { EXPOSED } from "@/utils/helpers/patchHelper";

export default [
	"new SPacketLoginStart({" +
		"requestedUuid:localStorage.getItem(REQUESTED_UUID_KEY)??void 0," +
		'session:localStorage.getItem(SESSION_TOKEN_KEY)??"",' +
		'hydration:localStorage.getItem("hydration")??"0",' +
		"prefetch:localStorage.getItem(MUTE_STORAGE_KEY)??void 0," +
		'metricsId:localStorage.getItem("metrics_id")??"",' +
		"clientVersion:VERSION$1," +
		"language:Options.language.value" +
		"})",
	{
		replacement: /*js*/ `new SPacketLoginStart({
  requestedUuid: undefined,
  session: (${EXPOSED}.moduleManager.antiBan.enabled
    ? await ${EXPOSED}.moduleManager.antiBan.getToken()
    : (localStorage.getItem(SESSION_TOKEN_KEY) ?? "")),
  hydration: "0",
  prefetch: undefined, // dear vector, a field called "prefetch" and then "MUTE_STORAGE_KEY" is suspicious and I'm going to randomize it either way. Thank you for not caring.
  metricsId: uuid(),
  clientVersion: VERSION$1,
  language: Options.language.value
  })`,
		shift: Shift.REPLACE,
	},
] satisfies SingleReplacement;
