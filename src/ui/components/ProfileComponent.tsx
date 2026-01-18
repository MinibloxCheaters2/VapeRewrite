import StoreInterop from "../../interop";

export default function Profiles() {
	const configs = StoreInterop.store.listConfigs();
	// StoreInterop.store.loadConfig;
	// StoreInterop.store.saveConfig;
	// TODO: randomization for these IDs and values
	const actionSelectID = "config-action",
		loadValue = "load",
		saveValue = "save";
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
			<select id={actionSelectID} required>
				{configs.map((cfg) => (
					<option value={cfg}>{cfg}</option>
				))}
				<button type="submit">Do it.</button>
			</select>
		</div>
	);
}
