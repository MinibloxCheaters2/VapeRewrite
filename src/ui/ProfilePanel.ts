import { getPanel } from "@violentmonkey/ui";
import { render } from "solid-js/web";
import Profiles from "./components/ProfileComponent";

const profilePanel = getPanel({
	theme: "dark",
});

// TODO: movable panels have issues with focus, where if you try to interact with a `select` element, then it won't work..?
profilePanel.setMovable(false, {
	origin: { x: "start", y: "start" },
});
profilePanel.show();

render(Profiles, profilePanel.body);
