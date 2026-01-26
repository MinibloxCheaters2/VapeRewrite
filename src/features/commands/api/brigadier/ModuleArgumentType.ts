import Mod from "@/features/module/api/Module";
import ModuleManager, { P } from "@/features/module/api/ModuleManager";
import { ArgumentType, CommandContext, CommandErrorType, StringReader, Suggestions, SuggestionsBuilder } from "@wq2/brigadier-ts";

export const MODULE_NOT_FOUND = new CommandErrorType(found => `Module "${found}" not found`);

export default class ModuleArgumentType extends ArgumentType<Mod> {

	listSuggestions(_context: CommandContext<unknown>, builder: SuggestionsBuilder): Promise<Suggestions> {
		const suggestions = ModuleManager.moduleNames.filter(m => m.toLowerCase().startsWith(builder.getRemaining().toLowerCase()));
		let b = builder;
		for (const suggestion of suggestions) {
			b = b.suggest(suggestion);
		}
		return b.buildPromise();
	}

	parse(reader: StringReader): Mod {
		const start = reader.getCursor();
		const name = reader.readString();
		const mod = ModuleManager.findModule(P.byName(name));
		if (mod === undefined) {
			reader.setCursor(start);
			throw MODULE_NOT_FOUND.createWithContext(reader, name);
		};
		return mod;
	}
}
