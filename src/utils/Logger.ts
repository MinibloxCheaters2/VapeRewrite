/**
 * Skidded straight from Vencord. Looks cool, so why not?
 */

import { REAL_CLIENT_NAME } from "@/Client";

export class Logger {
	/**
	 * Returns the console format args for a title with the specified background color and black text
	 * @param color Background color
	 * @param title Text
	 * @returns Array. Destructure this into {@link Logger}.errorCustomFmt or console.log
	 *
	 * @example logger.errorCustomFmt(...Logger.makeTitleElements("white", "Hello"), "World");
	 */
	static makeTitle(color: string, title: string): [string, ...string[]] {
		return [
			"%c %c %s ",
			"",
			`background: ${color}; color: black; font-weight: bold; border-radius: 5px;`,
			title,
		];
	}

	constructor(
		public name: string,
		public color: string = "white",
	) {}

	private l(
		level: "log" | "error" | "warn" | "info" | "debug",
		levelColor: string,
		args: unknown[],
		customFmt = "",
	) {
		console[level](
			`%c ${REAL_CLIENT_NAME} %c %c ${this.name} ${customFmt}`,
			`background: ${levelColor}; color: black; font-weight: bold; border-radius: 5px;`,
			"",
			`background: ${this.color}; color: black; font-weight: bold; border-radius: 5px;`,
			...args,
		);
	}

	public log(...args: unknown[]) {
		this.l("log", "#a6d189", args);
	}

	public info(...args: unknown[]) {
		this.l("info", "#a6d189", args);
	}

	public error(...args: unknown[]) {
		this.l("error", "#e78284", args);
	}

	public errorCustomFmt(fmt: string, ...args: unknown[]) {
		this.l("error", "#e78284", args, fmt);
	}

	public warn(...args: unknown[]) {
		this.l("warn", "#e5c890", args);
	}

	public debug(...args: unknown[]) {
		this.l("debug", "#eebebe", args);
	}
}
