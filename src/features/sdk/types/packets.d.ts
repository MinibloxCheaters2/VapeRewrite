import { S2CPacket } from "./packetTypes";

export class Message {
	constructor(j?: object);
}

export declare class SPacketLoginStart extends Message {
	session?: string;
	hydration?: string;
	metricsId: string;
	requestedUuid?: string;
	clientVersion: string;
}

export declare class PBItemStack extends Message {
	/**
	 * @type {PBItemStack}
	 */
	static EMPTY: PBItemStack;
	present: boolean;
	id?: number;
	stackSize?: number;
	durability?: number;
	data: string;
}

export declare class PBBlockPos extends Message {
	x: number;
	y: number;
	z: number;
}

export declare class PBVector3 extends Message {
	x: number;
	y: number;
	z: number;
}

export declare class PBFloatVector3 extends Message {
	x: number;
	y: number;
	z: number;
	constructor(pos: { x: number; y: number; z: number });
}

export declare class CPacketEntityVelocity extends Message {
	id: number;
	motion: PBFloatVector3;
}

export declare class CPacketChunkData extends Message {
	x: number;
	z: number;
	cells: PBCell[];
	tileEntities: PBTileEntity[];
	dimension: number;
	biomes: number[];
}

export declare class PBCell extends Message {
	y: number;
	bitsPerEntry: number;
	palette: number;
	bitArray: Uint8Array;
	blockRefCount: number;
}

export declare class PBTileEntity extends Message {
	x: number;
	y: number;
	z: number;
	nbt: Uint8Array;
}
export declare class CPacketEntityEquipment extends Message {
	id: number;
	equipment: Equipment[];
}
export declare class Equipment extends Message {
	slot: Equipment_Slot;
	item: PBItemStack;
}
export declare class SPacketUpdateInventory extends Message {
	main: PBItemStack[];
	armor: PBItemStack[];
	idkWhatThisIs: PBItemStack;
}
export declare class CPacketUpdateSign extends Message {
	pos: PBBlockPos;
	lines: string[];
}
export declare class CPacketUpdateCommandBlock extends Message {
	pos: PBBlockPos;
	command: string;
	commands: string[];
	repeat: boolean;
}
export declare class SPacketCloseWindow extends Message {
	windowId: number;
}
export declare class SPacketEntityAction extends Message {
	id: number;
	sneak?: boolean;
	sprinting?: boolean;
	punching?: boolean;
	fire?: boolean;
	stopSleeping?: boolean;
}
export declare class SPacketPlayerAbilities extends Message {
	isFlying: boolean;
}
export declare class SPacketPlayerPosLook extends Message {
	pos?: PBFloatVector3;
	yaw?: number;
	pitch?: number;
	onGround: boolean;
}
export declare class Vector3 {
	x: number;
	y: number;
	z: number;
	constructor(data: { x: number; y: number; z: number });
}
export declare class SPacketRespawn$1 {}
export declare class SPacketOpenShop extends Message {}
export declare class SPacketBreakBlock extends Message {
	location: PBBlockPos;
	start: boolean;
}
export declare class SPacketClick extends Message {
	location: PBBlockPos;
}
export declare class SPacketPlaceBlock extends Message {
	positionIn: PBBlockPos;
	side: PBEnumFacing;
	hitX: number;
	hitY: number;
	hitZ: number;
}
export declare class SPacketUseItem extends Message {}
export declare class SPacketClickWindow extends Message {
	windowId: number;
	slotId: number;
	button: number;
	mode: number;
	itemStack: PBItemStack;
	transactionId: number;
}
export declare class SPacketPlayerAction extends Message {
	position: PBBlockPos;
	facing: PBEnumFacing;
	action: PBAction;
}
export declare class SPacketUseEntity extends Message {
	id: number;
	action: SPacketUseEntity_Action;
	hitVec?: PBFloatVector3;
}
export declare class SPacketMessage extends Message {
	text: string;
}
export declare class CPacketAnimation extends Message {
	id: number;
	type: number;
}
export declare class CPacketBlockAction extends Message {
	blockPos: PBBlockPos;
	instrument: number;
	pitch: number;
	blockId: number;
}
export declare class CPacketBlockUpdate extends Message {
	id: number;
	x: number;
	y: number;
	z: number;
	prerender?: boolean;
}
export declare class CPacketChangeServers extends Message {
	url: string;
}
export declare class CPacketCloseWindow extends Message {
	windowId: number;
}
export declare class CPacketConfirmTransaction extends Message {
	windowId: number;
	uid: number;
	accepted: boolean;
}
export declare class CPacketDestroyEntities extends Message {
	ids: number[];
}
export declare class CPacketDisconnect extends Message {
	reason: string;
}
export declare class CPacketEntityAction extends Message {
	id: number;
	sneak?: boolean;
	sprinting?: boolean;
	punching?: boolean;
	fire?: boolean;
}
export declare class CPacketEntityAttach extends Message {
	leash: number;
	entity: number;
	vehicle: number;
}
export declare class CPacketEntityMetadata extends Message {
	id: number;
	data: PBWatchableObject[];
}
export declare class PBWatchableObject extends Message {
	dataValueId: number;
	objectType: number;
	intValue?: number;
	floatValue?: number;
	stringValue?: string;
	vector?: PBVector3;
	itemStack?: PBItemStack;
	blockPos?: PBBlockPos;
}
export declare class CPacketEntityPositionAndRotation extends Message {
	id: number;
	pos?: PBVector3;
	vel?: PBVector3;
	yaw?: number;
	pitch?: number;
	onGround?: boolean;
}
export declare class CPacketEntityRelativePositionAndRotation extends Message {
	id: number;
	pos: PBVector3;
	vel: PBVector3;
	yaw: number;
	pitch: number;
	onGround: boolean;
}
export declare class CPacketEntityStatus extends Message {
	entityId: number;
	entityStatus: number;
}
export declare class CPacketExplosion extends Message {
	pos: PBFloatVector3;
	strength: number;
	blocks: PBBlockPos[];
	playerPos?: PBFloatVector3;
}
export declare class PBCosmetics extends Message {
	skin: string;
	cape: string;
	aura: string;
	trail: string;
	color: string;
	hat: string;
}
export declare class CPacketServerInfo extends Message {
	serverId: string;
	serverName: string;
	serverVersion: string;
	serverCategory: string;
	accessControl: string;
	worldType: string;
	doDaylightCycle: boolean | null;
	inviteCode: string | null;
	cheats: boolean | null;
	pvpEnabled: boolean | null;
	startTime: bigint;
	playerPermissionEntries: PlayerPermissionEntry[];
	metadata: string | null;
	commandBlocksEnabled: boolean | null;
}
export declare class PlayerPermissionEntry extends Message {
	uuid: string;
	username: string;
	permissionLevel: number;
	color: string | null;
	rank: number | null;
	level: number | null;
	verified: boolean | null;
	toString(): string;
}
export declare class CPacketJoinGame extends Message {
	canConnect: boolean;
	errorMessage: string;
	tick: number;
	gamemode: string;
	name: string;
	enablePlayerCollision: boolean;
	cosmetics: PBCosmetics;
	rank: string;
	serverInfo: CPacketServerInfo;
	uuid: string;
	dimension: number;
}
export declare class CPacketLeaderboard extends Message {
	id: string;
	pos: PBVector3;
	yaw: number | null;
	title: string;
	content: string[];
}
export declare class CPacketLocalStorage extends Message {
	action: CPacketLocalStorage_Action;
	key: string;
	value: string | null;
}
/** @enum */
export declare const CPacketLocalStorage_Action: {
	DEFAULT: number;
	0: string;
	REMOVE: number;
	1: string;
	SET: number;
	2: string;
};
export declare class CPacketMessage extends Message {
	text?: string;
	id?: string;
	color?: string;
	discard?: boolean;
	toast?: boolean;
	timer?: number;
}
export declare class CPacketOpenShop extends Message {
	type: string;
}
export declare class CPacketOpenWindow extends Message {
	windowId: number;
	guiID: string;
	title?: string;
	size?: number;
}
export declare class CPacketParticles extends Message {
	particleId: number;
	longDistance?: boolean;
	x?: number;
	y?: number;
	z?: number;
	xOffset?: number;
	yOffset?: number;
	zOffset?: number;
	speed?: number;
	count?: number;
	particleArguments: number[];
}
export declare class CPacketPlayerList extends Message {
	players: PlayerData[];
}
export declare class PlayerData extends Message {
	id: number;
	uuid: string;
	permissionLevel: number;
	ping?: number;
	name?: string;
	color?: string;
	rank?: string;
	level?: number;
	verified?: boolean;
}
export declare class CPacketPlayerPosLook extends Message {
	x: number;
	y: number;
	z: number;
	yaw: number;
	pitch: number;
}
export declare class CPacketPlayerPosition extends Message {
	x: number;
	y: number;
	z: number;
}
export declare class CPacketPlayerReconciliation extends Message {
	x: number;
	y: number;
	z: number;
	yaw: number;
	pitch: number;
	lastProcessedInput: number;
	reset?: boolean;
}
export declare class CPacketPong extends Message {
	time: number;
	mspt: number;
	tick: number;
}
export declare class CPacketRespawn extends Message {
	notDeath?: boolean;
	client?: boolean;
	dimension?: number;
}
export declare class CPacketScoreboard extends Message {
	title: string;
	content: ScoreboardContent[];
}
export declare class ScoreboardContent extends Message {
	columns: string[];
}
export declare class CPacketServerMetadata extends Message {
	metadata: string;
}
export declare class CPacketSetSlot extends Message {
	windowId: number;
	slot: number;
	slotData: PBItemStack;
}
export declare class CPacketSignEditorOpen extends Message {
	signPosition: PBBlockPos;
}
export declare class CPacketSoundEffect extends Message {
	sound: string;
	location?: PBVector3;
	volume?: number;
	pitch?: number;
}
export declare class CPacketSpawnEntity extends Message {
	id: number;
	type: number;
	pos?: PBVector3;
	yaw?: number;
	pitch?: number;
	motion?: PBFloatVector3;
	item?: PBItemStack;
	shooterId?: number;
	state?: number;
	texture?: string;
}
export declare class CPacketSpawnExperienceOrb extends Message {
	id: number;
	x: number;
	y: number;
	z: number;
	xpValue: number;
}
export declare class CPacketSpawnPlayer extends Message {
	id: number;
	name: string;
	gamemode: string;
	operator?: boolean;
	pos: PBFloatVector3;
	yaw: number;
	pitch: number;
	cosmetics: PBCosmetics;
	rank?: string;
	socketId: string;
}
export declare class CPacketTabComplete extends Message {
	matches: string[];
}
export declare class CPacketTitle extends Message {
	title: string;
	duration: number;
}
export declare class CPacketUpdateHealth extends Message {
	id: number;
	hp?: number;
	food?: number;
	foodSaturation?: number;
	oxygen?: number;
}
export declare class CPacketUpdateLeaderboard extends Message {
	id: string;
	content: string[];
}
export declare class CPacketUpdateScoreboard extends Message {
	index: number;
	columns: string[];
}
export declare class CPacketUpdateStatus extends Message {
	id: number;
	mode?: number;
	rank?: string;
	color?: string;
	hidePlayers?: boolean;
}
export declare class CPacketUpdate extends Message {
	tick: number;
	t: number;
	mspt: number;
}
export declare class CPacketWindowItems extends Message {
	windowId: number;
	items: PBItemStack[];
}
export declare class CPacketWindowProperty extends Message {
	windowId: number;
	varIndex: number;
	varValue: number;
}
export declare class SPacketRespawn extends Message {}
export declare class SPacketTabComplete$1 {
	message: string;
}
export declare class SPacketCraftItem extends Message {
	data: string;
}
export declare class SPacketRequestChunk extends Message {
	x: number;
	z: number;
}
export declare class SPacketAdminAction extends Message {
	action: {
		case: undefined;
	};
}
export declare class KickPlayer extends Message {}
export declare class BanPlayer extends Message {
	uuid: string;
}
export declare class UnbanPlayer extends Message {
	uuid: string;
}
export declare class StopServer extends Message {}
export declare class PromotePlayer extends Message {
	uuid: string;
}
export declare class DemotePlayer extends Message {
	uuid: string;
}
export declare class UpdateAccessControl extends Message {
	accessControl: string;
}
export declare class UpdateCheats extends Message {
	cheats: string;
}
export declare class UpdatePvP extends Message {
	enabled: boolean;
}
export declare class SPacketAnalytics extends Message {
	fps: number;
	ping: number;
}
export declare class SPacketConfirmTransaction extends Message {
	windowId: number;
	actionNumber: number;
	accepted: boolean;
}
export declare class SPacketHeldItemChange extends Message {
	slot: number;
}
export declare class SPacketPlayerInput extends Message {
	sequenceNumber: number;
	left: boolean;
	right: boolean;
	up: boolean;
	down: boolean;
	yaw: number;
	pitch: number;
	jump: boolean;
	sneak: boolean;
	sprint: boolean;
	pos: PBFloatVector3;
}
export declare class SPacketPing extends Message {
	time: number;
}
export declare class SPacketUpdateSign extends Message {
	pos: PBBlockPos;
	lines: string[];
}
export declare class CPacketEntityEffect extends Message {
	id: number;
	effectId: number;
	amplifier: number;
	duration: number;
	hideParticles: boolean;
}
export declare class CPacketEntityProperties extends Message {
	id: number;
	data: PBSnapshot[];
}
export declare class PBSnapshot extends Message {
	id: string;
	value: number;
	modifiers: PBModifier[];
}
export declare class PBModifier extends Message {
	id: string;
	amount: number;
	operation: number;
}
export declare class CPacketQueueNext extends Message {
	minigameId: string;
	minigameConfig: string;
}
export declare class CPacketRemoveEntityEffect extends Message {
	id: number;
	effectId: number;
}
export declare class CPacketSetExperience extends Message {
	experience: number;
	experienceTotal: number;
	level: number;
}
export declare class CPacketShopProperty extends Message {
	name?: string;
	value?: string;
}
export declare class CPacketShopProperties extends Message {
	properties: CPacketShopProperty[];
}
export declare class CPacketUseBed extends Message {
	id: number;
	bedPos: PBBlockPos;
}
export declare class CPacketTimeUpdate extends Message {
	totalTime: number;
	worldTime: number;
}
export declare class ClientBoundCombined extends Message {
	packets: ClientBoundCombined_CPacket[];
}
export declare class ClientBoundCombined_CPacket extends Message {
	packet: S2CPacket;
}
export declare class SPacketEnchantItem extends Message {}
export declare class SPacketQueueNext extends Message {}
export declare class SPacketUpdateCommandBlock extends Message {
	pos: PBBlockPos;
	command: string | null;
	commands: string[] | null;
	repeat: boolean | null;
}
export declare const CPACKET_MAP: {
		CPacketAnimation: typeof CPacketAnimation;
		CPacketBlockAction: typeof CPacketBlockAction;
		CPacketBlockUpdate: typeof CPacketBlockUpdate;
		CPacketChangeServers: typeof CPacketChangeServers;
		CPacketChunkData: typeof CPacketChunkData;
		CPacketCloseWindow: typeof CPacketCloseWindow;
		CPacketConfirmTransaction: typeof CPacketConfirmTransaction;
		CPacketDestroyEntities: typeof CPacketDestroyEntities;
		CPacketDisconnect: typeof CPacketDisconnect;
		CPacketEntityAction: typeof CPacketEntityAction;
		CPacketEntityEquipment: typeof CPacketEntityEquipment;
		CPacketEntityMetadata: typeof CPacketEntityMetadata;
		CPacketEntityPositionAndRotation: typeof CPacketEntityPositionAndRotation;
		CPacketEntityRelativePositionAndRotation: typeof CPacketEntityRelativePositionAndRotation;
		CPacketEntityStatus: typeof CPacketEntityStatus;
		CPacketEntityVelocity: typeof CPacketEntityVelocity;
		CPacketExplosion: typeof CPacketExplosion;
		CPacketJoinGame: typeof CPacketJoinGame;
		CPacketLeaderboard: typeof CPacketLeaderboard;
		CPacketLocalStorage: typeof CPacketLocalStorage;
		CPacketMessage: typeof CPacketMessage;
		CPacketOpenWindow: typeof CPacketOpenWindow;
		CPacketParticles: typeof CPacketParticles;
		CPacketPlayerList: typeof CPacketPlayerList;
		CPacketPlayerPosition: typeof CPacketPlayerPosition;
		CPacketPlayerPosLook: typeof CPacketPlayerPosLook;
		CPacketPlayerReconciliation: typeof CPacketPlayerReconciliation;
		CPacketPong: typeof CPacketPong;
		CPacketRespawn: typeof CPacketRespawn;
		CPacketScoreboard: typeof CPacketScoreboard;
		CPacketServerInfo: typeof CPacketServerInfo;
		CPacketSetSlot: typeof CPacketSetSlot;
		CPacketSignEditorOpen: typeof CPacketSignEditorOpen;
		CPacketSoundEffect: typeof CPacketSoundEffect;
		CPacketSpawnEntity: typeof CPacketSpawnEntity;
		CPacketSpawnPlayer: typeof CPacketSpawnPlayer;
		CPacketTabComplete: typeof CPacketTabComplete;
		CPacketTitle: typeof CPacketTitle;
		CPacketUpdate: typeof CPacketUpdate;
		CPacketUpdateHealth: typeof CPacketUpdateHealth;
		CPacketUpdateLeaderboard: typeof CPacketUpdateLeaderboard;
		CPacketUpdateScoreboard: typeof CPacketUpdateScoreboard;
		CPacketUpdateSign: typeof CPacketUpdateSign;
		CPacketUpdateStatus: typeof CPacketUpdateStatus;
		CPacketWindowItems: typeof CPacketWindowItems;
		CPacketWindowProperty: typeof CPacketWindowProperty;
		CPacketUseBed: typeof CPacketUseBed;
		CPacketQueueNext: typeof CPacketQueueNext;
		CPacketSpawnExperienceOrb: typeof CPacketSpawnExperienceOrb;
		CPacketSetExperience: typeof CPacketSetExperience;
		CPacketOpenShop: typeof CPacketOpenShop;
		CPacketShopProperties: typeof CPacketShopProperties;
		CPacketEntityProperties: typeof CPacketEntityProperties;
		CPacketEntityEffect: typeof CPacketEntityEffect;
		CPacketRemoveEntityEffect: typeof CPacketRemoveEntityEffect;
		CPacketUpdateCommandBlock: typeof CPacketUpdateCommandBlock;
		CPacketEntityAttach: typeof CPacketEntityAttach;
		CPacketServerMetadata: typeof CPacketServerMetadata;
		CPacketTimeUpdate: typeof CPacketTimeUpdate;
		ClientBoundCombined: typeof ClientBoundCombined;
	},
	SPACKET_MAP: {
		SPacketAdminAction: typeof SPacketAdminAction;
		SPacketAnalytics: typeof SPacketAnalytics;
		SPacketClickWindow: typeof SPacketClickWindow;
		SPacketCloseWindow: typeof SPacketCloseWindow;
		SPacketConfirmTransaction: typeof SPacketConfirmTransaction;
		SPacketEnchantItem: typeof SPacketEnchantItem;
		SPacketEntityAction: typeof SPacketEntityAction;
		SPacketHeldItemChange: typeof SPacketHeldItemChange;
		SPacketLoginStart: typeof SPacketLoginStart;
		SPacketMessage: typeof SPacketMessage;
		SPacketOpenShop: typeof SPacketOpenShop;
		SPacketPing: typeof SPacketPing;
		SPacketPlayerAbilities: typeof SPacketPlayerAbilities;
		SPacketPlayerAction: typeof SPacketPlayerAction;
		SPacketPlayerPosLook: typeof SPacketPlayerPosLook;
		SPacketRespawn: typeof SPacketRespawn;
		SPacketTabComplete: typeof SPacketTabComplete$1;
		SPacketUpdateSign: typeof SPacketUpdateSign;
		SPacketUseEntity: typeof SPacketUseEntity;
		SPacketUpdateCommandBlock: typeof SPacketUpdateCommandBlock;
		SPacketQueueNext: typeof SPacketQueueNext;
		SPacketPlayerInput: typeof SPacketPlayerInput;
		SPacketBreakBlock: typeof SPacketBreakBlock;
		SPacketClick: typeof SPacketClick;
		SPacketCraftItem: typeof SPacketCraftItem;
		SPacketPlaceBlock: typeof SPacketPlaceBlock;
		SPacketRequestChunk: typeof SPacketRequestChunk;
		SPacketUpdateInventory: typeof SPacketUpdateInventory;
		SPacketUseItem: typeof SPacketUseItem;
	},
	NAME_TO_ID: { [k: string]: number },
	ID_TO_PACKET: { [id: number]: AnyPacket },
	ID_TO_NAME: { [id: number]: string };
