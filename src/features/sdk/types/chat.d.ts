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
	addChat(data: ChatData): void;
}
