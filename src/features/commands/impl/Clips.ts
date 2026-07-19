import { argument, FloatArgumentType, literal } from "@wq2/brigadier-ts";
import Miniblox from "@/utils/refs/miniblox";
import dispatcher from "../api/CommandDispatcher";

dispatcher.register(
	literal("vclip").then(
		argument("by", new FloatArgumentType()).executes(async (e) => {
			const amount = e.get<number>("by");
			const pos = Miniblox.player.pos.clone();
			Miniblox.player.setPosition(pos.x, pos.y + amount, pos.z);
			Miniblox.chat.addChat({
				text: `Vertically clipped ${amount} blocks!`,
				color: "blue",
			});
		}),
	),
);

dispatcher.register(
	literal("xclip").then(
		argument("by", new FloatArgumentType()).executes(async (e) => {
			const amount = e.get<number>("by");
			const pos = Miniblox.player.pos.clone();
			Miniblox.player.setPosition(pos.x + amount, pos.y, pos.z);
			Miniblox.chat.addChat({
				text: `X-Axis clipped ${amount} blocks!`,
				color: "blue",
			});
		}),
	),
);
dispatcher.register(
	literal("zclip").then(
		argument("by", new FloatArgumentType()).executes(async (e) => {
			const amount = e.get<number>("by");
			const pos = Miniblox.player.pos.clone();
			Miniblox.player.setPosition(pos.x, pos.y, pos.z + amount);
			Miniblox.chat.addChat({
				text: `Z-Axis clipped ${amount} blocks!`,
				color: "blue",
			});
		}),
	),
);

dispatcher.register(
	literal("clip").then(
		argument("byX", new FloatArgumentType()).then(
			argument("byY", new FloatArgumentType()).then(
				argument("byZ", new FloatArgumentType()).executes(async (e) => {
					const byX = e.get<number>("byX");
					const byY = e.get<number>("byY");
					const byZ = e.get<number>("byZ");
					const pos = Miniblox.player.pos.clone();
					Miniblox.player.setPosition(
						pos.x + byX,
						pos.y + byY,
						pos.z + byZ,
					);
					Miniblox.chat.addChat({
						text: `Clipped X: ${byX}, Y: ${byY}, Z: ${byZ} blocks!`,
						color: "blue",
					});
				}),
			),
		),
	),
);
