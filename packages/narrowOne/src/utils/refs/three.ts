import { expose } from "@vape/core/exposed";

type ThreeModule = typeof import("three");
type ThreeExport = keyof ThreeModule;

function getThreeImport(): string | undefined {
	return performance.getEntriesByType("resource").find((x) => {
		const {name} = x;
		console.log(x.name);
		return name.startsWith("https://narrow.one/js/colors-") && name.endsWith(".js");
	})?.name;
}

function importColorsNoRetry() {
	const scriptURL = getThreeImport();
	if (!scriptURL) return undefined;
	return import(scriptURL);
}

/**
 * Imports colors.js, which mostly contains ThreeJS and other types of thingies.
 */
function importColors() {
	const scriptURL = getThreeImport();
	if (!scriptURL) return new Promise<any>(r => {
		let t: number;
		t = setInterval(() => {
			const colors = importColorsNoRetry();
			if (!colors) return;
			r(colors);
			clearInterval(t);
		}, 5);
	});
	return import(scriptURL);
}

let three: object;

importColors().then((t) => {
	three = t;
	expose("THREE_RAW", () => t);
});

function findObject(filter: (clazz: NewableFunction) => boolean) {
	return Object.values(three).find(filter);
}

function findByPrototypeKey<T extends ThreeExport>(key: string): ThreeModule[T] {
	return findObject((x) => {
		return (
			typeof x === "function" &&
			"prototype" in x &&
			typeof x.prototype === "object" &&
			key in x.prototype &&
			x.prototype[key]
		);
	});
}

function findObjectByType<const N extends ThreeExport>(type: N): ThreeModule[N] {
	return findObject(
		(x) =>
			x != null &&
			typeof x === "function" &&
			x.toString().includes(`this.type="${type}"`),
	);
}

const THREE = {
	get BoxGeometry() {
		return findObjectByType("BoxGeometry");
	},

	get BufferAttribute() {
		return findByPrototypeKey<"BufferAttribute">("isBufferAttribute");
	},

	get BufferGeometry() {
		return findObjectByType("BufferGeometry");
	},

	// colors.js bundle doesn't export this
	// get MathUtils(): ThreeModule["MathUtils"] {
	// 	return findObject(x => typeof x === "object"
	// 		&& Object.getPrototypeOf(x) === null
	// 		&& "clamp" in x
	// 		&& "DEG2RAD" in x);
	// },

	get Line() {
		return findObjectByType("Line");
	},

	get LineBasicMaterial() {
		return findObjectByType("LineBasicMaterial");
	},

	get Mesh() {
		return findObjectByType("Mesh");
	},

	get MeshBasicMaterial() {
		return findObjectByType("MeshBasicMaterial");
	},

	get Quaternion() {
		return findByPrototypeKey<"Quaternion">("isQuaternion");
	},

	get Vec3() {
		return findByPrototypeKey<"Vector3">("isVector3");
	},

	get Euler() {
		return findByPrototypeKey<"Euler">("isEuler");
	},

	// dropped by bundler
	// get Spherical() {
	// 	return findByPrototypeKey<"Spherical">("isSpherical");
	// },

	get Vec2() {
		return findByPrototypeKey<"Vector2">("isVector2");
	},
};

expose("THREE", () => THREE);

export default THREE;
