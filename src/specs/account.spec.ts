import "mocha";
// import {expect} from "chai";
import { DsxExchange } from "../api/index";

describe("Spec on account ", () => {
  const dsx = new DsxExchange({
    verbose: true,
    secretKey: "56789",
    apiKey: "ec5aacb5-f9f0-4ad1-b5a8-9e02da3a5ddc"
  });

  it("get account information", async () => {
    const res = await dsx.accountInformation();

    console.log(JSON.stringify(res));
  });

  it("get account volumes", async () => {
    const res = await dsx.tradingVolume();

    console.log(JSON.stringify(res));
  });

  it("get fees", async () => {
    const res = await dsx.tradingFees();
    console.log(JSON.stringify(res));
  });
});
