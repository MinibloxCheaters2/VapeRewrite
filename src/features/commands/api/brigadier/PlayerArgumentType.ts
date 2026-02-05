import {
	ArgumentType,
	type CommandContext,
	CommandErrorType,
	type StringReader,
	type Suggestions,
	type SuggestionsBuilder,
} from "@wq2/brigadier-ts";
import type { EntityPlayer } from "@/features/sdk/types/entity";
import Refs from "@/utils/refs";

export const PLAYER_NOT_FOUND = new CommandErrorType(
	(found) => `Player "${found}" not found`,
);

export default class ModuleArgumentType extends ArgumentType<EntityPlayer> {
	listSuggestions(
		_context: CommandContext<unknown>,
		builder: SuggestionsBuilder,
	): Promise<Suggestions> {
		const suggestions = Refs.world.players
			.values()
			.filter((m) =>
				m.name
					.toLowerCase()
					.startsWith(builder.getRemaining().toLowerCase()),
			)
			.map((m) => m.name);
		let b = builder;
		for (const suggestion of suggestions) {
			b = b.suggest(suggestion);
		}
		return b.buildPromise();
	}

	parse(reader: StringReader): EntityPlayer {
		const start = reader.getCursor();
		const name = reader.readString();
		const plr = Refs.world.players
			.values()
			.find((p) => p.name.toLowerCase() === name.toLowerCase());

		if (plr === undefined) {
			reader.setCursor(start);
			throw PLAYER_NOT_FOUND.createWithContext(reader, name);
		}

		return plr;
	}
}
