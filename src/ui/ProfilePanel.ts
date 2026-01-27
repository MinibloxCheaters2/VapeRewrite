import { getPanel } from "@wq2/ui";
import { render } from "solid-js/web";
import Profiles from "./components/ProfileComponent";

const profilePanel = getPanel({
	theme: "dark",
});

profilePanel.setMovable(true, {
	canDrag(e) {
		const target = e.target as HTMLElement;

		return !!target.closest("select, option, input, textarea, button, label");
	},
});
profilePanel.show();

render(Profiles, profilePanel.body);
