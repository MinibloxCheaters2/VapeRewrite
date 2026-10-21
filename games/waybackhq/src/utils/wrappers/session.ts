import { Session } from "@wq2/waybackhq-types/src/net/session";

const sessionPromise = import("@wq2/waybackhq-types/src/net/session");
export let session: typeof Session;
export const ready = sessionPromise.then(({ Session }) => {
	session = Session;
});
