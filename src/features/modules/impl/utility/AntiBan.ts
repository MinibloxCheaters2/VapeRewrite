import randomUsername from "@/utils/helpers/username";
import logger from "@/utils/logging/loggers";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export interface AccountData {
	name: string;
	session: string;
}

const GUEST_TOKEN = "";

interface NonAccountData {
	session: string;
	requestedUuid?: string;
}

export default class AntiBan extends Mod {
	name = "AntiBan";
	category = Category.UTILITY;

	private integration = this.createToggleSetting("AccountGen", false);
	private endpoint = this.createTextBoxSetting(
		"APIServerLocation",
		"http://localhost:3785/",
	);

	private nonAccountModeSetting = this.createDropdownSetting(
		"NonAccountMode",
		["Legacy", "New"],
		"Legacy",
		() => !this.genEnabled,
	);
	private usernameModeSetting = this.createDropdownSetting(
		"UsernameMode",
		["Random", "Static"],
		"Random",
		() => this.nonAccountMode === "New",
	);
	private usernameSetting = this.createTextBoxSetting(
		"Username",
		"",
		"Enter a username...",
		() => this.nonAccountMode === "New",
	);

	get genEnabled(): boolean {
		return this.integration.value();
	}

	get apiServerLocation(): URL {
		return new URL(this.endpoint.value());
	}

	get username() {
		return !this.genEnabled &&
			this.nonAccountMode === "New" &&
			this.usernameModeSetting.value() === "Static"
			? this.usernameSetting.value()
			: randomUsername();
	}

	get nonAccountMode() {
		return this.nonAccountModeSetting.value();
	}

	get generateMinibloxAccountEndpoint(): URL {
		return new URL("/v1/generate/miniblox", this.apiServerLocation);
	}

	get v1TestEndpoint(): URL {
		return new URL("/v1/test", this.apiServerLocation);
	}

	private async isAPIServerOnline(): Promise<boolean> {
		return fetch(this.v1TestEndpoint, {
			method: "HEAD",
		})
			.then(() => true)
			.catch((e) => {
				logger.error(
					"Failed to check if API server is online (probably offline):",
					e,
				);
				return false;
			});
	}

	/** note: it's recommended to default to a guest account if this fails or the API server is offline. */
	async #generateAccount(): Promise<AccountData> {
		const r = await fetch(this.generateMinibloxAccountEndpoint);
		if (!r.ok) {
			throw new Error(
				"Failed to generate account, check API server logs!",
			);
		}
		return await r.json();
	}

	public async canUseAccountGen(): Promise<boolean> {
		return (
			this.genEnabled &&
			this.apiServerLocation &&
			(await this.isAPIServerOnline())
		);
	}

	public handleNonAccount(): NonAccountData {
		switch (this.nonAccountMode) {
			case "Legacy":
				return { session: GUEST_TOKEN };
			case "New":
				return {
					session: GUEST_TOKEN,
					requestedUuid: this.username,
				};
		}
	}

	public async getToken(): Promise<string> {
		if (await this.canUseAccountGen()) {
			const acc = this.#generateAccount()
				.then((r) => r.session)
				.catch((e) => {
					logger.error("Failed to create an account:", e);
					return GUEST_TOKEN;
				});
			return acc;
		}
		return GUEST_TOKEN;
	}
}
