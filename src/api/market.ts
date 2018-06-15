import { Exchange } from "./exchange";
import * as _ from "lodash";
const debug = require("debug")("DSX.Api:");

export interface MarketInfo {
  server_time: number;
  pairs: { [key: string]: Pair };
}

export interface Pair {
  decimal_places: number;
  min_price: number;
  max_price: number;
  min_amount: number;
  hidden: number;
  fee: number;
  amount_decimal_places: number;
  quoted_currency: string;
  base_currency: string;
}

export type PriceQty = [number, number];

export function converToPriceAndQty(pq: PriceQty) {
  return {
    price: pq[0],
    qty: pq[1]
  };
}

export interface OrderBook {
  asks: Array<PriceQty>;
  bids: Array<PriceQty>;
  market_buy_price: number;
  market_sell_price: number;
}

export type Trades = Trade[];
export interface Trade {
  amount: number;
  price: number;
  timestamp: number;
  tid: number;
  type: "ask" | "bid";
}

export interface Ticker {
  high: number;
  low: number;
  avg: number;
  vol: number;
  vol_cur: number;
  last: number;
  buy: number;
  sell: number;
  updated: number;
  pair: string;
}

function checkPair(pair: string): string {
  if (!pair) {
    debug("Empty symbol!");
    throw "Empty symbol!";
  }
  return _.toLower(pair);
}

export interface Bar {
  high: number;
  open: number;
  low: number;
  close: number;
  amount: number;
  timestamp: number;
}

export class ExchangeMarket extends Exchange {
  info(): Promise<MarketInfo> {
    let params = this.sign("info");
    debug("info params", params);
    return this.request(params);
  }

  async orderBook(pair: string): Promise<OrderBook> {
    pair = checkPair(pair);
    const res = await this.request(
      this.sign("depth/{pair}", "mapi", "GET", { pair })
    );

    if (!res[pair]) {
      throw "Error response: did not receive messages.";
    }

    return res[pair];
  }

  async trades(pair: string, limit?: number): Promise<Trades> {
    pair = checkPair(pair);
    const res = await this.request(
      this.sign("trades/{pair}", "mapi", "GET", { pair, limit })
    );

    if (!res[pair]) {
      throw "Error response: did not receive messages.";
    }

    return res[pair];
  }

  async ticker(pair: string): Promise<Ticker> {
    pair = checkPair(pair);
    const res = await this.request(
      this.sign("ticker/{pair}", "mapi", "GET", { pair })
    );
    if (!res[pair]) {
      throw "Error response: did not receive messages.";
    }
    return res[pair];
  }

  async lastBars(
    pair: string,
    period: "m" | "h" | "d",
    amount: number
  ): Promise<Bar[]> {
    pair = checkPair(pair);
    const res = await this.request(
      this.sign("lastBars/{pair}/{period}/{amount}", "mapi", "GET", {
        pair,
        period,
        amount
      })
    );
    if (!res[pair]) {
      throw "Error response: did not receive messages.";
    }
    return res[pair];
  }

  async barsFromMoment(
    pair: string,
    period: "m" | "h" | "d",
    first_bar_close_time: number
  ): Promise<Bar[]> {
    pair = checkPair(pair);
    const res = await this.request(
      this.sign(
        "barsFromMoment/{pair}/{period}/{first_bar_close_time}",
        "mapi",
        "GET",
        { pair, period, first_bar_close_time }
      )
    );
    if (!res[pair]) {
      throw "Error response: did not receive messages.";
    }
    return res[pair];
  }

  async periodBars(
    pair: string,
    period: "m" | "h" | "d",
    first_bar_close_time,
    last_bar_close_time: number
  ): Promise<Bar[]> {
    pair = checkPair(pair);
    const res = await this.request(
      this.sign(
        "periodBars/{pair}/{period}/{first_bar_close_time}/{last_bar_close_time}",
        "mapi",
        "GET",
        { pair, period, first_bar_close_time, last_bar_close_time }
      )
    );
    if (!res[pair]) {
      throw "Error response: did not receive messages.";
    }
    return res[pair];
  }
}
