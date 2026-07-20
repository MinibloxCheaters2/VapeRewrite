import { gameScript, gameScriptReady } from "@/hooks/gameScript";
//import { parse } from "@wq2/packet-gen-wasm";
import logger from "../logging/loggers";

async function init() {
	await gameScriptReady;
	const result = VM.parse(gameScript);
	logger.info("Parsed game script", result);
	return result;
}

export const ready = init();
