import * as packets from "./yes";

/** SPacket / Serverbound packets */
export type C2SPacket =
	| packets.SPacketAdminAction
	| packets.SPacketAnalytics
	| packets.SPacketClickWindow
	| packets.SPacketCloseWindow
	| packets.SPacketConfirmTransaction
	| packets.SPacketEnchantItem
	| packets.SPacketEntityAction
	| packets.SPacketHeldItemChange
	| packets.SPacketLoginStart
	| packets.SPacketMessage
	| packets.SPacketOpenShop
	| packets.SPacketPing
	| packets.SPacketPlayerAbilities
	| packets.SPacketPlayerAction
	| packets.SPacketPlayerPosLook
	| packets.SPacketRespawn
	| packets.SPacketTabComplete$1
	| packets.SPacketUpdateSign
	| packets.SPacketUseEntity
	| packets.SPacketUpdateCommandBlock
	| packets.SPacketQueueNext
	| packets.SPacketPlayerInput
	| packets.SPacketBreakBlock
	| packets.SPacketClick
	| packets.SPacketCraftItem
	| packets.SPacketPlaceBlock
	| packets.SPacketRequestChunk
	| packets.SPacketUpdateInventory
	| packets.SPacketUseItem;

/** CPacket / Clientbound packets */
export type S2CPacket =
	| packets.CPacketAnimation
	| packets.CPacketBlockAction
	| packets.CPacketBlockUpdate
	| packets.CPacketChangeServers
	| packets.CPacketChunkData
	| packets.CPacketCloseWindow
	| packets.CPacketConfirmTransaction
	| packets.CPacketDestroyEntities
	| packets.CPacketDisconnect
	| packets.CPacketEntityAction
	| packets.CPacketEntityEquipment
	| packets.CPacketEntityMetadata
	| packets.CPacketEntityPositionAndRotation
	| packets.CPacketEntityRelativePositionAndRotation
	| packets.CPacketEntityStatus
	| packets.CPacketEntityVelocity
	| packets.CPacketExplosion
	| packets.CPacketJoinGame
	| packets.CPacketLeaderboard
	| packets.CPacketLocalStorage
	| packets.CPacketMessage
	| packets.CPacketOpenWindow
	| packets.CPacketParticles
	| packets.CPacketPlayerList
	| packets.CPacketPlayerPosition
	| packets.CPacketPlayerPosLook
	| packets.CPacketPlayerReconciliation
	| packets.CPacketPong
	| packets.CPacketRespawn
	| packets.CPacketScoreboard
	| packets.CPacketServerInfo
	| packets.CPacketSetSlot
	| packets.CPacketSignEditorOpen
	| packets.CPacketSoundEffect
	| packets.CPacketSpawnEntity
	| packets.CPacketSpawnPlayer
	| packets.CPacketTabComplete
	| packets.CPacketTitle
	| packets.CPacketUpdate
	| packets.CPacketUpdateHealth
	| packets.CPacketUpdateLeaderboard
	| packets.CPacketUpdateScoreboard
	| packets.CPacketUpdateSign
	| packets.CPacketUpdateStatus
	| packets.CPacketWindowItems
	| packets.CPacketWindowProperty
	| packets.CPacketUseBed
	| packets.CPacketQueueNext
	| packets.CPacketSpawnExperienceOrb
	| packets.CPacketSetExperience
	| packets.CPacketOpenShop
	| packets.CPacketShopProperties
	| packets.CPacketEntityProperties
	| packets.CPacketEntityEffect
	| packets.CPacketRemoveEntityEffect
	| packets.CPacketUpdateCommandBlock
	| packets.CPacketEntityAttach
	| packets.CPacketServerMetadata
	| packets.CPacketTimeUpdate;
// note: Miniblox's ClientDecoder handles these by re-triggering the receive packet event for client bound combined packets.
/*| packets.ClientBoundCombined*/

export type AnyPacket = C2SPacket | S2CPacket;
