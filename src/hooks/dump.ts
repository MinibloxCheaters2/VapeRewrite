export default {
	moveStrafe: /strafe: *this\.([a-zA-Z]*)/m,
	moveForward: /forward: *this\.([a-zA-Z]*)/m,
	keyPressedPlayer:
		/function ([a-zA-Z]*)\(([a-zA-Z]*)\) \{\n\t*return keyPressed/m,
	// World#getLivingEntityCount
	entities:
		/this\.([a-zA-Z]*)\.values\(\)\) [a-zA-Z]* instanceof EntityLiving/m,
	isInvisible:
		/[a-zA-Z]+\.([a-zA-Z]*)\(\)\) &&\n\t*\([a-zA-Z]* = new [a-zA-Z]*\(/m,
	attackTargetEntityWithCurrentItem:
		/hitVec.z,\n\t*\}\),\n\t*\}\),\n\t*\),\n\t*player.([a-zA-Z]*)\(/m,
	lastReportedYaw: /this\.([a-zA-Z]*) *= *this\.yaw\),\n*\t*\(this\.last/m,
	windowClick: /([a-zA-Z]*)\(this\.inventorySlots\.windowId/m,
	damageReduceAmount:
		/ItemArmor && \([a-zA-Z]+ \+= [a-zA-Z]*\.item\.([a-zA-Z]*)/,
	playerController: /const ([a-zA-Z]*) *= *new *PlayerController\(/,
	boxGeometry: /w = new Mesh\(\n\t*new ([a-zA-Z]*)\(1, 1, 1\),/m,
	// playerControllerMP
	syncItem: /([a-zA-Z]*)\(\),\n\t*ClientSocket\.sendPacket/m,
	// GLTF manager
	gltfManager: /([a-zA-Z]*)("|'|`), new GLTFManager/,
	AxisAlignedBoundingBox: /this\.boundingBox *= *new *([a-zA-Z]*)/m,
	loadModels: /loadTextures\(\),*\n\t*this\.[a-zA-Z]*\.([a-zA-Z]*)\(\)/m,
	// Shader Manager
	addShaderToMaterialWorld: /ShaderManager\.([a-zA-Z]*)\(this\.materialWorld/,
	materialTransparentWorld:
		/this\.([a-zA-Z]*) *= *this\.materialTransparent\.clone\(/,
};
