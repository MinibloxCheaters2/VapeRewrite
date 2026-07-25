import { Show } from "solid-js";
import { render } from "solid-js/web";
import getResourceURL from "@/utils/helpers/cachedResourceURL";
import CategoryListPanel from "./CategoryListPanel";
import { ColorSliderComponent, ToggleComponent } from "./components";
import {
	friendsColorHue,
	friendsColorSat,
	friendsColorVal,
	friendsEnabled,
	friendsList,
	recolorVisuals,
	setFriendsColorHue,
	setFriendsColorSat,
	setFriendsColorVal,
	setFriendsEnabled,
	setFriendsList,
	setRecolorVisuals,
	setUseFriends,
	useFriends,
} from "./globalSettings";
import {
	friendsPanelVisible,
	guiVisible,
	setFriendsPanelVisible,
} from "./guiState";
import shadowWrapper from "./shadowWrapper";

function FriendsPanelContent() {
	const addItem = (val: string) => {
		setFriendsList((prev) => [...prev, val]);
		setFriendsEnabled((prev) => [...prev, val]);
	};

	const removeItem = (val: string) => {
		setFriendsList((prev) => prev.filter((n) => n !== val));
		setFriendsEnabled((prev) => prev.filter((n) => n !== val));
	};

	const toggleItem = (val: string) => {
		setFriendsEnabled((prev) =>
			prev.includes(val) ? prev.filter((n) => n !== val) : [...prev, val],
		);
	};

	const isVisible = () => guiVisible() && friendsPanelVisible();

	return (
		<Show when={isVisible()}>
			<CategoryListPanel
				name="Friends"
				iconURL={getResourceURL("friendstab")}
				iconSize={[17, 16]}
				placeholder="Roblox username"
				accentColor={`rgb(${Math.round(friendsColorHue() * 255)}, ${Math.round(friendsColorSat() * 255)}, ${Math.round(friendsColorVal() * 255)})`}
				initialPosition={{ x: 240, y: 46 }}
				visible={isVisible()}
				setVisible={setFriendsPanelVisible}
				items={friendsList}
				enabledItems={friendsEnabled}
				addItem={addItem}
				removeItem={removeItem}
				toggleItem={toggleItem}
			>
				<ToggleComponent
					name="Recolor visuals"
					enabled={recolorVisuals()}
					onChange={setRecolorVisuals}
				/>
				<ColorSliderComponent
					name="Friends color"
					hue={friendsColorHue()}
					sat={friendsColorSat()}
					value={friendsColorVal()}
					opacity={1}
					onChange={(h, s, v) => {
						setFriendsColorHue(h);
						setFriendsColorSat(s);
						setFriendsColorVal(v);
					}}
				/>
				<ToggleComponent
					name="Use friends"
					enabled={useFriends()}
					onChange={setUseFriends}
				/>
			</CategoryListPanel>
		</Show>
	);
}

export function initFriendsPanel() {
	const container = document.createElement("div");
	container.id = "friends-panel-container";
	shadowWrapper.wrapper.appendChild(container);
	render(() => <FriendsPanelContent />, container);
}
