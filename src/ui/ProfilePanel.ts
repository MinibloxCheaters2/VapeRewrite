import { getPanel } from "@wq2/ui";
import { render } from "solid-js/web";
import Profiles from "./components/ProfileComponent";
import { dragHandleAttrName } from "@/utils/names";

const profilePanel = getPanel({
	theme: "dark",
});
profilePanel.setMovable(true, {
	canDrag(e) {
		const target = e.target as HTMLElement;
		return !!target.closest(`[${dragHandleAttrName}]`);
	},
});

profilePanel.show();

render(Profiles, profilePanel.body);
