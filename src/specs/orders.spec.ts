import "mocha";
import { expect } from "chai";
import { DsxExchange } from "../api/index";

describe("Spec on orders", () => {
  const dsx = new DsxExchange({
    verbose: true,
    secretKey: "56789",
    apiKey: "56789"
  });

  xit("create order", async () => {
    const res = await dsx.createOrder({
      pair: "LTCBTC",
      rate: 0.0222,
      volume: 1,
      orderType: "limit",
      type: "Sell"
    });
    console.log(JSON.stringify(res, null, 2));
  });

  it("cancel order", async () => {
    try {
      const orderId = 143964293;
      await dsx.cancelOrder(orderId);
    } catch (e) {
      expect(e.error).to.eq("Order has already been killed.");
    }
  });

  it("cancel all orders", async () => {
    console.log(await dsx.cancelAllOrders());
  });

  it("get order status", async () => {
    const res = await dsx.getOrderStatus(143964293);

    console.log(JSON.stringify(res));
  });
});
