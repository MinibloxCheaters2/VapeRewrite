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
	addChat(data: ChatData): void;
	autoCompleteReceived(packet: CPacketTabComplete): void;
	clear(): void;
}
