import type { CPacketServerInfo, CPacketServerMetadata, PlayerPermissionEntry } from "./packets";

export class ServerInfo {
	serverId: string;
	serverVersion: string;
	serverName: string;
	serverCategory: string;
	worldType: string;
	permissionLevel: PermissionLevel = PermissionLevel.NONE;
	accessControl: AccessControl = AccessControl.NONE;
	cheats: Cheats = Cheats.DISABLED;
	inviteCode: string = null;
	pvpEnabled: boolean = false;
	commandBlocksEnabled: boolean = true;
	doDaylightCycle: boolean = true;
	startTime: number;
	playerPermissionEntries: PlayerPermissionEntry[] = [];
	metadata: object = {};
    handlePacket(pkt: CPacketServerInfo): void;
    handleMetadataUpdate(u: CPacketServerMetadata): void;
}
