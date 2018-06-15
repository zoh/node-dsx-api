import {
  Bar,
  ExchangeMarket,
  MarketInfo,
  OrderBook,
  Ticker,
  Trades
} from "./market";
import { Exchange, InitCfg } from "./exchange";
import {
  ExchangeHistory,
  HistoryOrder,
  HistoryTrade,
  HistoryTradeRequest,
  HistoryTransaction,
  OrderType,
  TransactionsRequest
} from "./history";
import { ExchangeOrder, Funds, Order, OrderStatus } from "./orders";
import { AccountInfo, AccountVolume, ExchangeClient } from "./client";
import { ExchangeDeposit } from "./deposit";

export class DsxExchange extends Exchange
  implements
    ExchangeMarket,
    ExchangeHistory,
    ExchangeOrder,
    ExchangeClient,
    ExchangeDeposit {
  protected apiKey: string;
  protected secretKey: string;
  protected verbose: boolean = false;
  protected demo: boolean = false;

  constructor(cfg?: InitCfg) {
    super(cfg);

    if (cfg) {
      this.apiKey = cfg.apiKey;
      this.secretKey = cfg.secretKey;

      this.verbose = cfg.verbose;
      this.demo = cfg.demo;
    }
  }

  info: () => Promise<MarketInfo>;

  orderBook: (pair: string) => Promise<OrderBook>;

  trades: (pair: string, limit?: number) => Promise<Trades>;

  ticker: (pair: string) => Promise<Ticker>;

  lastBars: (
    pair: string,
    period: "m" | "h" | "d",
    amount: number
  ) => Promise<Bar[]>;

  barsFromMoment: (
    pair: string,
    period: "m" | "h" | "d",
    first_bar_close_time: number
  ) => Promise<Bar[]>;

  periodBars: (
    pair: string,
    period: "m" | "h" | "d",
    first_bar_close_time,
    last_bar_close_time: number
  ) => Promise<Bar[]>;

  transactions: (
    req: TransactionsRequest
  ) => Promise<{ [orderId: string]: HistoryTransaction }>;

  historyTrades: (
    req?: HistoryTradeRequest
  ) => Promise<{ [tradeId: string]: HistoryTrade }>;

  historyOrders: (
    req?: { count?: number; fromId?: number; endId?: number; order?: OrderType }
  ) => Promise<{ [orderId: string]: HistoryOrder }>;

  getActiveOrders: (
    symbol?: string
  ) => Promise<{ [orderId: string]: HistoryOrder }>;

  createOrder: (
    req: {
      type: "Buy" | "Sell";
      rate?: number;
      volume: number;
      pair: string;
      orderType: "limit" | "market" | "fill-or-kill";
    }
  ) => Promise<Order>;

  cancelOrder: (orderId) => Promise<Order>;

  cancelAllOrders: () => Promise<Funds>;

  getOrderStatus: (orderId: number) => Promise<OrderStatus>;

  accountInformation: () => Promise<AccountInfo>;

  tradingVolume: () => Promise<AccountVolume>;

  tradingFees: () => Promise<any>;

  transferStatus: (id: number) => Promise<any>;
}

applyMixins(DsxExchange, [
  ExchangeMarket,
  ExchangeHistory,
  ExchangeOrder,
  ExchangeClient,
  ExchangeDeposit
]);

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}
