import { getPanel } from "@wq2/ui";
import { render } from "solid-js/web";
import { dragHandleAttrName } from "@/utils/names";
import Profiles from "./components/ProfileComponent";

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
