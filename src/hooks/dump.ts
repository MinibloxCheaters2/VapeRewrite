// TODO: a lot of these got broken by global name remapping, and he is remapping more methods now.
const DUMP_REGEXES = {
	moveForward: /this\.([a-zA-Z]+)=\([a-zA-Z]+\.(up|down)/m,
	moveStrafe:
		/this\.([a-zA-Z]+)=\+!!\w\.right\s*\+\s*\(\w\.left\s*\?\s*-1\s*\:\s*0\)/m,
	// PathNavigateGround#isPositionClear
	iterator: /of\s*\w+\.([a-zA-Z]+)\(new/,
	// EntityBoat#update
	normalizeAngle: /([a-zA-Z]+)\(this\.boatYaw\s*-\s*this.yaw\)/,
	// PlayerMovement#updatePlayerMoveState
	applyInput: /this\.(\w+)\(this\.currentInput\)/,
	getMoveDirection:
		/([a-zA-Z]+)\(\w\)[\s\S]*?>=\s*1e-4[\s\S]*?Math\.cos\(this\.yaw\)/,
	updatePlayerMoveState:
		/this\.([a-zA-Z]*)\(\),\n*\s*this\.isUsingItem\(\)\s*&&/,
	// PlayerMovement#checkHeadInBlock
	// position:
	// 	/null;\s*\n*\s*let\s*\w\s*=\s*\w+\.fromVector\(\w+\.([a-zA-Z]+)\)/g,
	// PlayerControllerMP#updateMouseOver
	isInvisible: /this\.capeMesh\s*&&\s*this\.entity\.([a-zA-Z]+)\(\)/m,
	// EntityItem#update
	pushOutOfBlocks: /this\.noPhysics\s*=\s*this\.(\w+)\(this/,
	// attackTargetEntityWithCurrentItem, in PlayerController#attackEntity
	attack: /\w+\.(\w+)\(e\),\n*\s*ft.hit()/,
	lastReportedYaw: /this\.([a-zA-Z]*)=this\.yaw,this\.last/m,
	windowClick: /([a-zA-Z]*)\(this\.inventorySlots\.windowId/m,
	damageReduceAmount: /\w\.item\.(\w+)\s*\|\|\s*0/,
	// playerControllerMP
	syncItem: /([a-zA-Z]*)\(\),\n*\s*\w+\.sendPacket\(new\s*/m,
	// GLTF manager
	gltfManager: /await \w+\.(\w+)\.getModel/,
	// AABB is in a separate module now, we can just scan for fields or code and find it ourselves.
	// Shader Manager
	addShaderToMaterialWorld:
		/static\s+(\w+)\(\w\)\s*\{\s*t\.userData\s*=\s*\{\s*time:\s*{\s*value:\s*2/,
	materialTransparentWorld:
		/this\.([a-zA-Z]*)\s*=\s*this\.materialTransparent\.clone\(/,
	potionAmplifiers:
		/\w+\.([a-zA-Z]+)\.set\(\w+\.([a-zA-Z]+)\.getId\(\),\s*`5`\)/,
	getFlag:
		/([a-zA-Z]+)\(([a-zA-Z]+)\)\s*{\s*\n*return\s*\(this\.dataWatcher\.getWatchableObjectByte\(0\)&1<<([a-zA-Z]+)\)!=0}/,
	setFlag:
		/setSprinting\(\w+\)\s*\{\n*\s*this\.([a-zA-Z]+)\([0-9]+,\s*([a-zA-Z]+)\)/,
	//EntityManager#shouldRenderEntity
	isInvisibleToPlayer:
		/!\w+\.world\.isBlockLoaded\(\w+\)\)\s*\|\|\s*!\w+\s*&&\s*\w+\.(\w+)\(\w+\)/m,
} as const;

export type DumpKey = keyof typeof DUMP_REGEXES;

export default DUMP_REGEXES;
