import { CPacketTabComplete } from "./packets";

export declare interface ChatData {
	text?: string;
	id?: string;
	color?: string;
	discard?: boolean;
	toast?: boolean;
	timer?: number;
}

export declare interface ChatLog extends ChatData {
	/** @default Date.now() */
	t: number;
	/** @default 0 */
	timer: number;
}

export declare class Chat {
	log: ChatLog[];
	inputHistory: string[];
	inputHistoryIndex: number;
	autoCompleteRequested: boolean;
	autoComplete: {
		active: boolean;
		index: number;
		list: string[];
	};
	inputValue: string;
	showInput: boolean;
	isInputCommandMode: boolean;
	setAutoCompleteDefault(): void;
	/** `idk` is only passed to `ClientSideCommands.tryExecuteClientSide` */
	submit(idk: unknown): void;
	getHistory(direction: "up" | "down"): void;
	setInputValue(value: string): void;
	openInput(commandMode: boolean): void;
	closeInput(): void;
	filterUsernames(data: ChatData): ChatData;
	addChat(data: ChatData): void;
	clear(): void;
	requestTabComplete(updateMoveBackwards: boolean): void;
	autoCompleteReceived(packet: CPacketTabComplete): void;
	updateInputWithAutoComplete(moveBackwards: boolean): void;
	static trimLastWord(input: string): string;
}
