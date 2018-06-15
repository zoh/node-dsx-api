import "mocha";
import { expect } from "chai";
import { DsxExchange } from "../api/index";

describe("History", () => {
  const dsx = new DsxExchange({
    verbose: true,
    secretKey: "56789",
    apiKey: "56789"
  });

  it("transactions", async () => {
    const res = await dsx.transactions({ count: 10, order: "ASC" });
    expect(res["888457"].id).to.eq(888457);
  });

  it("trades", async () => {
    console.log(JSON.stringify(await dsx.historyTrades()));
  });

  it("orders", async () => {
    const res = await dsx.historyOrders();
    console.log(JSON.stringify(res));
  });

  it("getActiveOrders", async () => {
    const res = await dsx.getActiveOrders("LTCUSD");

    expect(res["123967521"].pair).to.eq("ltcusd");
  });
});
