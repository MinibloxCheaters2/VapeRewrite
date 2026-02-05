import { literal } from "@wq2/brigadier-ts";
import Refs from "@/utils/refs";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("clear").executes(async () => {
		Refs.chat.clear();
		return 1;
	}),
);
