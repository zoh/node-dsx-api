import { Exchange } from "./exchange";

export interface Resp {
  success: number;
  return: Order;
}

export interface RespFunds {
  success: number;
  return: Funds;
}

export interface Funds {
  funds: { [coin: string]: Coin };
}

export interface Order {
  received: number;
  remains: number;
  funds: { [coin: string]: Coin };
  orderId: number;
}

export interface Coin {
  total: number;
  available: number;
}

export interface OrderStatus {
  pair: string;
  type: "buy" | "sell";
  remainingVolume: number;
  volume: number;
  rate: number;
  timestampCreated: number;
  status: OrderStatusType;
  orderType: "limit" | "market" | "fill-or-kill";
  deals: any[];
}

export enum OrderStatusType {
  Active = 0,
  Filled = 1,
  Killed = 2,
  Killing = 3,
  Rejected = 7
}

export class ExchangeOrder extends Exchange {
  async createOrder(req: {
    type: "Buy" | "Sell";
    rate?: number;
    volume: number;
    pair: string;
    orderType: "limit" | "market" | "fill-or-kill";
  }): Promise<Order> {
    const res: Resp = await this.request(
      this.sign("order/new", "tapi", "POST", req)
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }

  async cancelOrder(orderId): Promise<Order> {
    const res: Resp = await this.request(
      this.sign("order/cancel", "tapi", "POST", { orderId })
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }

  async cancelAllOrders(): Promise<Funds> {
    const res: RespFunds = await this.request(
      this.sign("order/cancel/all", "tapi", "POST")
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }

  async getOrderStatus(orderId: number): Promise<OrderStatus> {
    const res: { success: number; return: OrderStatus } = await this.request(
      this.sign("order/status", "tapi", "POST", { orderId })
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }
}
