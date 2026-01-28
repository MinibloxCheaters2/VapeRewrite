import { randomIntInclusive, randomString } from "@/utils/random";
import StoreInterop from "../../interop";

export default function Profiles() {
	const configs = StoreInterop.store.listConfigs();
	// StoreInterop.store.loadConfig;
	// StoreInterop.store.saveConfig;
	// TODO: randomization for these IDs and values
	const actionSelectID = randomString(randomIntInclusive(6, 9)),
		loadValue = randomString(randomIntInclusive(4, 6)),
		saveValue = randomString(randomIntInclusive(6, 17));

	return (
		<div>
			{/* vertically stacked */}
			<div
				style={{
					display: "flex",
					"align-items": "center",
					gap: "0.5rem",
					padding: "0.5rem 0.75rem",
				}}
			>
				<label for={actionSelectID}>Choose an action:</label>
				<select id={actionSelectID} required>
					<option value={loadValue}>Load</option>
					<option value={saveValue}>Save</option>
				</select>
			</div>
			<label for={actionSelectID}>
				Choose a config to perform this operation on
			</label>
			<select required>
				{configs.map((cfg) => (
					<option value={cfg}>{cfg}</option>
				))}
			</select>
			<button type="submit">Do it.</button>
		</div>
	);
}
