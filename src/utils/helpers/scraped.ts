/**
 * Scrapes all packets from the game script and makes dummy messages & enums for them.
 * @module
 */

import type { Message } from "@wq2/miniblox-sdk";
import type {
	MappedEnumGroup,
	MappedMessage,
	Syntax,
} from "@wq2/packet-gen-wasm";
import { ready as packetsPromise } from "../network/WasmTest";
import Miniblox from "../refs/miniblox";

const scrapedMessages: MappedMessage[] = [];
const scrapedEnums: MappedEnumGroup[] = [];
let _Syntax: typeof Syntax;

export async function init() {
	const { result: p, wasmExports } = await packetsPromise;
	_Syntax = wasmExports.Syntax;

	const messages = p.messages;
	const pkts = Miniblox.packets;
	const filtered = pkts
		? messages.filter(
				(m) =>
					pkts.find(
						(x) =>
							(
								x.constructor as ((a: object) => unknown) & {
									typeName: string;
								}
							).typeName === m.typeName,
					) === undefined,
			)
		: messages;
	scrapedMessages.push(...filtered);
	scrapedEnums.push(...p.enums);
}
export function asMessage<T extends object>(msg: MappedMessage): Message<T> {
	const msgClass = Miniblox.Message;
	const runtime =
		msg.syntax === _Syntax.Proto3 ? Miniblox.proto3 : Miniblox.proto2;

	if (runtime === undefined)
		throw new Error(`Failed to find runtime for ${msg.syntax}`);
	return class packetClass extends msgClass<T> {
		constructor(args?: T) {
			super();
			(
				runtime as {
					util: {
						initPartial: (a: T | undefined, b: msgClass<T>) => void;
					};
				}
			).util.initPartial(args, this);
		}

		static fromBinary(a, b) {
			return new packetClass().fromBinary(a, b);
		}
		static fromJson(a, b) {
			return new packetClass().fromJson(a, b);
		}
		static fromJsonString(a, b) {
			return new packetClass().fromJsonString(a, b);
		}
		static equals(a, b) {
			return runtime.util.equals(packetClass, a, b);
		}
	};
}

export const ready = init();
