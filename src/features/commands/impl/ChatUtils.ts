import { literal } from "@wq2/brigadier-ts";
import Miniblox from "@/utils/refs/miniblox";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("clear").executes(async () => {
		Miniblox.chat.clear();
	}),
);
