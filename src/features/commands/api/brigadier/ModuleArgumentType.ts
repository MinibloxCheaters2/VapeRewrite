import { ArgumentType, CommandContext, CommandErrorType, StringReader, Suggestions, SuggestionsBuilder } from "@wq2/brigadier-ts";
import ModuleManager, { P } from "../../../module/api/ModuleManager";
import Mod from "../../../module/api/Module";
import logger from "../../../../utils/loggers";

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
		logger.info("Parse with reader:", reader);
		const start = reader.getCursor();
		const name = reader.readString();
		logger.info("Module name:", name);
		const mod = ModuleManager.findModule(P.byName(name));
		if (mod === undefined) {
			reader.setCursor(start);
			throw MODULE_NOT_FOUND.createWithContext(reader, name);
		};
		return mod;
	}
}
