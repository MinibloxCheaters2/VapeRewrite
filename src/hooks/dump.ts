const DUMP_REGEXES = {
	moveForward: /this\.([a-zA-Z]+)=\([a-zA-Z]+\.right/m,
	moveStrafe: /this\.([a-zA-Z]+)=\([a-zA-Z]+\.(up|down)/m,
	keyPressedPlayer:
		/function\s+([a-zA-Z]*)\(([a-zA-Z]*)\)\s*\{\n*\s*return\s+keyPressed/m,
	// World#getLivingEntityCount
	entities:
		/this\.([a-zA-Z]*)\.values\(\)\)\s*[a-zA-Z]* instanceof EntityLiving/m,
	// PlayerControllerMP#updateMouseOver
	isInvisible:
		/\.mode\.isSpectator\(\)\s*\|\|\s*w\.([a-zA-Z]*)\(\)/m,
	attackTargetEntityWithCurrentItem: /hitVec.z\}\)\}\)\),player\.([a-zA-Z]*)/,
	lastReportedYaw: /this\.([a-zA-Z]*)=this\.yaw,this\.last/m,
	windowClick: /([a-zA-Z]*)\(this\.inventorySlots\.windowId/m,
	damageReduceAmount:
		/ItemArmor\s*&&\s*\([a-zA-Z]+\s*\+=\s*[a-zA-Z]*\.item\.([a-zA-Z]*)/,
	playerController: /const ([a-zA-Z]*)\s*=\s*new\s+PlayerController,/,
	boxGeometry: /w\s*=\s*new\s+Mesh\s*\(new ([a-zA-Z]*)\(1/m,
	// playerControllerMP
	syncItem: /([a-zA-Z]*)\(\),\n*\s*ClientSocket\.sendPacket/m,
	// GLTF manager
	gltfManager: /([a-zA-Z]*)("|'|`),\s*new GLTFManager/,
	AxisAlignedBoundingBox: /this\.boundingBox\s*=\s*new\s+([a-zA-Z]*)/m,
	loadModels: /loadTextures\(\),*\n*\s*this\.[a-zA-Z]*\.([a-zA-Z]*)\(\)/m,
	// Shader Manager
	addShaderToMaterialWorld: /ShaderManager\.([a-zA-Z]*)\(this\.materialWorld/,
	materialTransparentWorld:
		/this\.([a-zA-Z]*)\s*=\s*this\.materialTransparent\.clone\(/,
};

export type DumpKey = keyof typeof DUMP_REGEXES;

export default DUMP_REGEXES;
