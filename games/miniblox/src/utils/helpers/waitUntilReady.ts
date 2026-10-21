import { ready } from "../refs";
import { waitForReact } from "./waitForReact";

export default async function waitUntilReady(): Promise<void> {
	await Promise.all([ready, waitForReact()]);
}
