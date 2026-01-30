import Bus from "@/Bus";

export default class SubscribeOnInit {
	constructor() {
		Bus.registerSubscriber(this);
	}
}
