import type { S2CPacket } from "./packetTypes";
import type SlotActionType from "./slotActionType";

export class Message<T extends object> {
	constructor(data?: T);
}

export declare class SPacketLoginStart extends Message<SPacketLoginStart> {
	session?: string;
	hydration?: string;
	metricsId: string;
	requestedUuid?: string;
	clientVersion: string;
}

export declare class PBItemStack extends Message<PBItemStack> {
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

export declare class PBBlockPos extends Message<PBBlockPos> {
	x: number;
	y: number;
	z: number;
}

export declare class PBVector3 extends Message<PBVector3> {
	x: number;
	y: number;
	z: number;
}

export declare class PBFloatVector3 extends Message<PBFloatVector3> {
	x: number;
	y: number;
	z: number;
	constructor(pos: { x: number; y: number; z: number });
}

export declare class CPacketEntityVelocity extends Message<CPacketEntityVelocity> {
	id: number;
	motion: PBFloatVector3;
}

export declare class CPacketChunkData extends Message<CPacketChunkData> {
	x: number;
	z: number;
	cells: PBCell[];
	tileEntities: PBTileEntity[];
	dimension: number;
	biomes: number[];
}

export declare class PBCell extends Message<PBCell> {
	y: number;
	bitsPerEntry: number;
	palette: number;
	bitArray: Uint8Array;
	blockRefCount: number;
}

export declare class PBTileEntity extends Message<PBTileEntity> {
	x: number;
	y: number;
	z: number;
	nbt: Uint8Array;
}
export declare class CPacketEntityEquipment extends Message<CPacketEntityEquipment> {
	id: number;
	equipment: Equipment[];
}
export declare class Equipment extends Message<Equipment> {
	slot: Equipment_Slot;
	item: PBItemStack;
}
export declare class SPacketUpdateInventory extends Message<SPacketUpdateInventory> {
	main: PBItemStack[];
	armor: PBItemStack[];
	idkWhatThisIs: PBItemStack;
}
export declare class CPacketUpdateSign extends Message<CPacketUpdateSign> {
	pos: PBBlockPos;
	lines: string[];
}
export declare class CPacketUpdateCommandBlock extends Message<CPacketUpdateCommandBlock> {
	pos: PBBlockPos;
	command: string;
	commands: string[];
	repeat: boolean;
}
export declare class SPacketCloseWindow extends Message<SPacketCloseWindow> {
	windowId: number;
}
export declare class SPacketEntityAction extends Message<SPacketEntityAction> {
	id: number;
	sneak?: boolean;
	sprinting?: boolean;
	punching?: boolean;
	fire?: boolean;
	stopSleeping?: boolean;
}
export declare class SPacketPlayerAbilities extends Message<SPacketPlayerAbilities> {
	isFlying: boolean;
}
export declare class SPacketPlayerPosLook extends Message<SPacketPlayerPosLook> {
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
export declare class SPacketOpenShop extends Message<SPacketOpenShop> {}
export declare class SPacketBreakBlock extends Message<SPacketBreakBlock> {
	location: PBBlockPos;
	start: boolean;
}
export declare class SPacketClick extends Message<SPacketClick> {
	location: PBBlockPos;
}
export declare class SPacketPlaceBlock extends Message<SPacketPlaceBlock> {
	positionIn: PBBlockPos;
	side: PBEnumFacing;
	hitX: number;
	hitY: number;
	hitZ: number;
}
export declare class SPacketUseItem extends Message<SPacketUseItem> {}
export declare class SPacketClickWindow extends Message<SPacketClickWindow> {
	windowId: number;
	slotId: number;
	button: number;
	/**
	 * the click mode, prefer using the enum unless you need a custom mode (i.e. exploiting bugs)
	 */
	mode: SlotActionType | number;
	itemStack: PBItemStack;
	transactionId: number;
}
export declare class SPacketPlayerAction extends Message<SPacketPlayerAction> {
	position: PBBlockPos;
	facing: PBEnumFacing;
	action: PBAction;
}
export declare class SPacketUseEntity extends Message<SPacketUseEntity> {
	id: number;
	action: SPacketUseEntity_Action;
	hitVec?: PBFloatVector3;
}
export declare class SPacketMessage extends Message<SPacketMessage> {
	text: string;
}
export declare class CPacketAnimation extends Message<CPacketAnimation> {
	id: number;
	type: number;
}
export declare class CPacketBlockAction extends Message<CPacketBlockAction> {
	blockPos: PBBlockPos;
	instrument: number;
	pitch: number;
	blockId: number;
}
export declare class CPacketBlockUpdate extends Message<CPacketBlockUpdate> {
	id: number;
	x: number;
	y: number;
	z: number;
	prerender?: boolean;
}
export declare class CPacketChangeServers extends Message<CPacketChangeServers> {
	url: string;
}
export declare class CPacketCloseWindow extends Message<CPacketCloseWindow> {
	windowId: number;
}
export declare class CPacketConfirmTransaction extends Message<CPacketConfirmTransaction> {
	windowId: number;
	uid: number;
	accepted: boolean;
}
export declare class CPacketDestroyEntities extends Message<CPacketDestroyEntities> {
	ids: number[];
}
export declare class CPacketDisconnect extends Message<CPacketDisconnect> {
	reason: string;
}
export declare class CPacketEntityAction extends Message<CPacketEntityAction> {
	id: number;
	sneak?: boolean;
	sprinting?: boolean;
	punching?: boolean;
	fire?: boolean;
}
export declare class CPacketEntityAttach extends Message<CPacketEntityAttach> {
	leash: number;
	entity: number;
	vehicle: number;
}
export declare class CPacketEntityMetadata extends Message<CPacketEntityMetadata> {
	id: number;
	data: PBWatchableObject[];
}
export declare class PBWatchableObject extends Message<PBWatchableObject> {
	dataValueId: number;
	objectType: number;
	intValue?: number;
	floatValue?: number;
	stringValue?: string;
	vector?: PBVector3;
	itemStack?: PBItemStack;
	blockPos?: PBBlockPos;
}
export declare class CPacketEntityPositionAndRotation extends Message<CPacketEntityPositionAndRotation> {
	id: number;
	pos?: PBVector3;
	vel?: PBVector3;
	yaw?: number;
	pitch?: number;
	onGround?: boolean;
}
export declare class CPacketEntityRelativePositionAndRotation extends Message<CPacketEntityRelativePositionAndRotation> {
	id: number;
	pos: PBVector3;
	vel: PBVector3;
	yaw: number;
	pitch: number;
	onGround: boolean;
}
export declare class CPacketEntityStatus extends Message<CPacketEntityStatus> {
	entityId: number;
	entityStatus: number;
}
export declare class CPacketExplosion extends Message<CPacketExplosion> {
	pos: PBFloatVector3;
	strength: number;
	blocks: PBBlockPos[];
	playerPos?: PBFloatVector3;
}
export declare class PBCosmetics extends Message<PBCosmetics> {
	skin: string;
	cape: string;
	aura: string;
	trail: string;
	color: string;
	hat: string;
}
export declare class CPacketServerInfo extends Message<CPacketServerInfo> {
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
export declare class PlayerPermissionEntry extends Message<PlayerPermissionEntry> {
	uuid: string;
	username: string;
	permissionLevel: number;
	color: string | null;
	rank: number | null;
	level: number | null;
	verified: boolean | null;
	toString(): string;
}
export declare class CPacketJoinGame extends Message<CPacketJoinGame> {
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
export declare class CPacketLeaderboard extends Message<CPacketLeaderboard> {
	id: string;
	pos: PBVector3;
	yaw: number | null;
	title: string;
	content: string[];
}
export declare class CPacketLocalStorage extends Message<CPacketLocalStorage> {
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
export declare class CPacketMessage extends Message<CPacketMessage> {
	text?: string;
	id?: string;
	color?: string;
	discard?: boolean;
	toast?: boolean;
	timer?: number;
}
export declare class CPacketOpenShop extends Message<CPacketOpenShop> {
	type: string;
}
export declare class CPacketOpenWindow extends Message<CPacketOpenWindow> {
	windowId: number;
	guiID: string;
	title?: string;
	size?: number;
}
export declare class CPacketParticles extends Message<CPacketParticles> {
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
export declare class CPacketPlayerList extends Message<CPacketPlayerList> {
	players: PlayerData[];
}
export declare class PlayerData extends Message<PlayerData> {
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
export declare class CPacketPlayerPosLook extends Message<CPacketPlayerPosLook> {
	x: number;
	y: number;
	z: number;
	yaw: number;
	pitch: number;
}
export declare class CPacketPlayerPosition extends Message<CPacketPlayerPosition> {
	x: number;
	y: number;
	z: number;
}
export declare class CPacketPlayerReconciliation extends Message<CPacketPlayerReconciliation> {
	x: number;
	y: number;
	z: number;
	yaw: number;
	pitch: number;
	lastProcessedInput: number;
	reset?: boolean;
}
export declare class CPacketPong extends Message<CPacketPong> {
	time: number;
	mspt: number;
	tick: number;
}
export declare class CPacketRespawn extends Message<CPacketRespawn> {
	notDeath?: boolean;
	client?: boolean;
	dimension?: number;
}
export declare class CPacketScoreboard extends Message<CPacketScoreboard> {
	title: string;
	content: ScoreboardContent[];
}
export declare class ScoreboardContent extends Message<ScoreboardContent> {
	columns: string[];
}
export declare class CPacketServerMetadata extends Message<CPacketServerMetadata> {
	metadata: string;
}
export declare class CPacketSetSlot extends Message<CPacketSetSlot> {
	windowId: number;
	slot: number;
	slotData: PBItemStack;
}
export declare class CPacketSignEditorOpen extends Message<CPacketSignEditorOpen> {
	signPosition: PBBlockPos;
}
export declare class CPacketSoundEffect extends Message<CPacketSoundEffect> {
	sound: string;
	location?: PBVector3;
	volume?: number;
	pitch?: number;
}
export declare class CPacketSpawnEntity extends Message<CPacketSpawnEntity> {
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
export declare class CPacketSpawnExperienceOrb extends Message<CPacketSpawnExperienceOrb> {
	id: number;
	x: number;
	y: number;
	z: number;
	xpValue: number;
}
export declare class CPacketSpawnPlayer extends Message<CPacketSpawnPlayer> {
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
export declare class CPacketTabComplete extends Message<CPacketTabComplete> {
	matches: string[];
}
export declare class CPacketTitle extends Message<CPacketTitle> {
	title: string;
	duration: number;
}
export declare class CPacketUpdateHealth extends Message<CPacketUpdateHealth> {
	id: number;
	hp?: number;
	food?: number;
	foodSaturation?: number;
	oxygen?: number;
}
export declare class CPacketUpdateLeaderboard extends Message<CPacketUpdateLeaderboard> {
	id: string;
	content: string[];
}
export declare class CPacketUpdateScoreboard extends Message<CPacketUpdateScoreboard> {
	index: number;
	columns: string[];
}
export declare class CPacketUpdateStatus extends Message<CPacketUpdateStatus> {
	id: number;
	mode?: number;
	rank?: string;
	color?: string;
	hidePlayers?: boolean;
}
export declare class CPacketUpdate extends Message<CPacketUpdate> {
	tick: number;
	t: number;
	mspt: number;
}
export declare class CPacketWindowItems extends Message<CPacketWindowItems> {
	windowId: number;
	items: PBItemStack[];
}
export declare class CPacketWindowProperty extends Message<CPacketWindowProperty> {
	windowId: number;
	varIndex: number;
	varValue: number;
}
export declare class SPacketRespawn extends Message<SPacketRespawn> {}
export declare class SPacketTabComplete$1 {
	message: string;
}
export declare class SPacketCraftItem extends Message<SPacketCraftItem> {
	data: string;
}
export declare class SPacketRequestChunk extends Message<SPacketRequestChunk> {
	x: number;
	z: number;
}
export declare class SPacketAdminAction extends Message<SPacketAdminAction> {
	action: {
		case: undefined;
	};
}
export declare class KickPlayer extends Message<KickPlayer> {}
export declare class BanPlayer extends Message<BanPlayer> {
	uuid: string;
}
export declare class UnbanPlayer extends Message<UnbanPlayer> {
	uuid: string;
}
export declare class StopServer extends Message<StopServer> {}
export declare class PromotePlayer extends Message<PromotePlayer> {
	uuid: string;
}
export declare class DemotePlayer extends Message<DemotePlayer> {
	uuid: string;
}
export declare class UpdateAccessControl extends Message<UpdateAccessControl> {
	accessControl: string;
}
export declare class UpdateCheats extends Message<UpdateCheats> {
	cheats: string;
}
export declare class UpdatePvP extends Message<UpdatePvP> {
	enabled: boolean;
}
export declare class SPacketAnalytics extends Message<SPacketAnalytics> {
	fps: number;
	ping: number;
}
export declare class SPacketConfirmTransaction extends Message<SPacketConfirmTransaction> {
	windowId: number;
	actionNumber: number;
	accepted: boolean;
}
export declare class SPacketHeldItemChange extends Message<SPacketHeldItemChange> {
	slot: number;
}
export declare class SPacketPlayerInput extends Message<SPacketPlayerInput> {
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
export declare class SPacketPing extends Message<SPacketPing> {
	time: number;
}
export declare class SPacketUpdateSign extends Message<SPacketUpdateSign> {
	pos: PBBlockPos;
	lines: string[];
}
export declare class CPacketEntityEffect extends Message<CPacketEntityEffect> {
	id: number;
	effectId: number;
	amplifier: number;
	duration: number;
	hideParticles: boolean;
}
export declare class CPacketEntityProperties extends Message<CPacketEntityProperties> {
	id: number;
	data: PBSnapshot[];
}
export declare class PBSnapshot extends Message<PBSnapshot> {
	id: string;
	value: number;
	modifiers: PBModifier[];
}
export declare class PBModifier extends Message<PBModifier> {
	id: string;
	amount: number;
	operation: number;
}
export declare class CPacketQueueNext extends Message<CPacketQueueNext> {
	minigameId: string;
	minigameConfig: string;
}
export declare class CPacketRemoveEntityEffect extends Message<CPacketRemoveEntityEffect> {
	id: number;
	effectId: number;
}
export declare class CPacketSetExperience extends Message<CPacketSetExperience> {
	experience: number;
	experienceTotal: number;
	level: number;
}
export declare class CPacketShopProperty extends Message<CPacketShopProperty> {
	name?: string;
	value?: string;
}
export declare class CPacketShopProperties extends Message<CPacketShopProperties> {
	properties: CPacketShopProperty[];
}
export declare class CPacketUseBed extends Message<CPacketUseBed> {
	id: number;
	bedPos: PBBlockPos;
}
export declare class CPacketTimeUpdate extends Message<CPacketTimeUpdate> {
	totalTime: number;
	worldTime: number;
}
export declare class ClientBoundCombined extends Message<ClientBoundCombined> {
	packets: ClientBoundCombined_CPacket[];
}
export declare class ClientBoundCombined_CPacket extends Message<ClientBoundCombined_CPacket> {
	packet: S2CPacket;
}
export declare class SPacketEnchantItem extends Message<SPacketEnchantItem> {}
export declare class SPacketQueueNext extends Message<SPacketQueueNext> {}
export declare class SPacketUpdateCommandBlock extends Message<SPacketUpdateCommandBlock> {
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
