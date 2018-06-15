import { expect } from "chai";
import "mocha";
import { DsxExchange } from "../api/index";
import { ErrorExchange } from "../api/exchange";
import * as _ from "lodash";

describe("Spec Market", () => {
  const dsx = new DsxExchange({ verbose: true, secretKey: "test" });

  it("Currency pairs", async () => {
    const info = await dsx.info();
    const btcusd = info.pairs["btcusd"];
    expect(btcusd).to.be.not.undefined;

    expect(btcusd).to.eqls({
      decimal_places: 5,
      min_price: 5000,
      max_price: 15000,
      min_amount: 0.0001,
      hidden: 0,
      fee: 0,
      amount_decimal_places: 5,
      quoted_currency: "USD",
      base_currency: "BTC"
    });
  });

  it("OrderType book", async () => {
    try {
      const res = await dsx.orderBook("erro");
      console.log(res);
    } catch (err) {
      const e = err as { error: ErrorExchange };

      expect(e).to.eq("Error response: did not receive messages.");
    }

    const res = await dsx.orderBook("BTCUSD");
    expect(res.bids.length).to.gt(0);
    expect(res.asks.length).to.gt(0);
  });

  it("Trades", async () => {
    const res = await dsx.trades("btcusd", 100);
    expect(res.length).to.eq(100);
  });

  it("Get ticker", async () => {
    const res = await dsx.ticker("btcusd");
    expect(res.pair).to.eq("btcusd");
  });

  it("Get last bars", async () => {
    const res = await dsx.lastBars("btcusd", "d", 10);
    expect(res.length).to.eq(10);
    expect(_.keys(res[0])).to.eqls([
      "high",
      "open",
      "low",
      "close",
      "amount",
      "timestamp"
    ]);
  });
});
