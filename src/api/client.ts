import { Exchange } from "./exchange";
import { Coin } from "./orders";

export interface AccountInfo {
  funds: { [coint: string]: Coin };
  rights: Rights;
  transactionCount: number;
  openOrders: number;
  serverTime: number;
}

export interface Rights {
  info: number;
  trade: number;
}

export interface AccountVolume {
  tradingVolume: number;
  tradesCount: number;
  currency: string;
}

export interface Fees {
  progressiveCommissions: ProgressiveCommissions;
}

export interface ProgressiveCommissions {
  commissions: Commission[];
  indexOfCurrentCommission: number;
  currency: string;
}

export interface Commission {
  tradingVolume: number;
  takerCommission: number;
  makerCommission: number;
}

export class ExchangeClient extends Exchange {
  async accountInformation(): Promise<AccountInfo> {
    const res: { success: number; return: AccountInfo } = await this.request(
      this.sign("info/account", "tapi", "POST")
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }

  async tradingVolume(): Promise<AccountVolume> {
    const res: { success: number; return: AccountVolume } = await this.request(
      this.sign("volume", "tapi", "POST")
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }

  async tradingFees(): Promise<Fees> {
    const res: { success: number; return: Fees } = await this.request(
      this.sign("fees", "tapi", "POST")
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }
}
