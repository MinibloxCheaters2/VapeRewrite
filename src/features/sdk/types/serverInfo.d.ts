import type {
	CPacketServerInfo,
	CPacketServerMetadata,
	PlayerPermissionEntry,
} from "./packets";

export class ServerInfo {
	serverId: string;
	serverVersion: string;
	serverName: string;
	serverCategory: string;
	worldType: string;
	/** @default PermissionLevel.NONE */
	permissionLevel: PermissionLevel;
	/** @default AccessControl.NONE */
	accessControl: AccessControl;
	/** @default Cheats.DISABLED */
	cheats: Cheats;
	/** @default null */
	inviteCode: string | null;
	/** @default false */
	pvpEnabled: boolean;
	/** @default true */
	commandBlocksEnabled: boolean;
	/** @default true */
	doDaylightCycle: boolean;
	startTime: number;
	/** @default [] */
	playerPermissionEntries: PlayerPermissionEntry[];
	/** @default {} */
	metadata: object;
	handlePacket(pkt: CPacketServerInfo): void;
	handleMetadataUpdate(u: CPacketServerMetadata): void;
}
