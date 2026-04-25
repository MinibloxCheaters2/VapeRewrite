import { literal } from "@wq2/brigadier-ts";
import Refs from "@/utils/helpers/refs";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("clear").executes(async () => {
		Refs.chat.clear();
	}),
);
