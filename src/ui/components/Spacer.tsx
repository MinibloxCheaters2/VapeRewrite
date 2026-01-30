import type { ParentProps } from "solid-js";

export default function Spacer(props: ParentProps<{ size: string }>) {
	return <div style={{ height: props.size }}></div>;
}
