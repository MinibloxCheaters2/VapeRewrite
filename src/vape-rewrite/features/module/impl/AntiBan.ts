import logger from "../../../utils/loggers";
import Category from "../api/Category";
import Mod from "../api/Module";

export interface AccountData {
  name: string;
  session: string;
}

const GUEST_TOKEN = "";

export default class AntiBan extends Mod {
  name = "AntiBan";
  category = Category.BLATANT;

  // TODO: replace this with settings stuff when settings are implemented
  get accGenIntegrationEnabled(): boolean {
    return false;
  }

  // TODO: replace this with settings stuff when settings are implemented
  get apiServerLocation(): URL {
    return new URL("http://localhost:3785/");
  }

  get generateMinibloxAccountEndpoint(): URL {
    return new URL("/v1/generate/miniblox", this.apiServerLocation);
  }

  get v1TestEndpoint(): URL {
    return new URL("/v1/test", this.apiServerLocation);
  }

  private async isAPIServerOnline(): Promise<boolean> {
    return fetch(this.v1TestEndpoint, {
      method: "HEAD"
    }).then(() => true).catch(e => {
      logger.error("Failed to check if API server is online (probably offline):", e);
      return false;
    });
  }

  /** note: it's recommended to default to a guest account if this fails or the API server is offline. */
  private async generateAccount(): Promise<AccountData> {
    const r = await fetch(this.generateMinibloxAccountEndpoint);
    if (!r.ok) {
      throw new Error("Failed to generate account, check API server logs!");
    }
    return await r.json();
  }

  // TODO(AntiBan): implement account gen functionality
  public async getToken(): Promise<string> {
    if (this.accGenIntegrationEnabled && this.apiServerLocation && await this.isAPIServerOnline()) {
      const acc = this.generateAccount().then(r => r.session).catch(e => {
        logger.error("Failed to create an account:", e);
        return GUEST_TOKEN;
      });
      return acc;
    }
    return GUEST_TOKEN;
  }
}
