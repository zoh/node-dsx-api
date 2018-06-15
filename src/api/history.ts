import { Exchange } from "./exchange";

export type OrderType = "ASC" | "DESC";

export type TransactionsRequest = {
  count?: number;
  fromId?: number;
  endId?: number;
  order?: OrderType;
  since?: number;
  end?: number;
  type?: "Withdraw" | "Incoming";
  status?: TransactionsRequestStatus;
  currency?: string;
};

export enum TransactionsRequestStatus {
  Failed = 1,
  Completed = 2,
  Processing = 3,
  Rejected = 4
}

interface HistoryResp<T> {
  success: number;
  return: { [id: string]: T };
}

export interface HistoryTransaction {
  id: number;
  timestamp: number;
  type: "Withdraw" | "Incoming";
  amount: number;
  currency: string;
  address: string;
  status: number;
  commission: number;
  txid?: string;
}

export interface HistoryTrade {
  pair: string;
  type: "buy" | "sell";
  volume: number;
  rate: number;
  orderId: number;
  timestamp: number;
  commission: number;
  commissionCurrency: string;
}

export interface HistoryOrder {
  pair: string;
  type: "buy" | "sell";
  volume: number;
  remainingVolume: number;
  rate: number;
  timestampCreated: number;
  status: number;
  orderType: string; // limit or market mb.
}

export interface HistoryTradeRequest {
  count?: number;
  fromId?: number;
  endId?: number;
  order?: OrderType;
  since?: number;
  end?: number;
  pair?: string;
}

/**
 * Reports and history
 */
export class ExchangeHistory extends Exchange {
  async transactions(
    req: TransactionsRequest
  ): Promise<{ [orderId: string]: HistoryTransaction }> {
    const res: HistoryResp<HistoryTransaction> = await this.request(
      this.sign("history/transactions", "tapi", "POST", req)
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }

  async historyTrades(
    req?: HistoryTradeRequest
  ): Promise<{ [tradeId: string]: HistoryTrade }> {
    const res: HistoryResp<HistoryTrade> = await this.request(
      this.sign("history/trades", "tapi", "POST", req)
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }

  async historyOrders(req?: {
    count?: number;
    fromId?: number;
    endId?: number;
    order?: OrderType;
  }) {
    const res: HistoryResp<HistoryOrder> = await this.request(
      this.sign("history/orders", "tapi", "POST", req)
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }

  async getActiveOrders(symbol?: string) {
    const res: HistoryResp<HistoryOrder> = await this.request(
      this.sign("orders", "tapi", "POST", { pair: symbol })
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }
}
