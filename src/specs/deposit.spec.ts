import "mocha";
// import {expect} from "chai";
import { DsxExchange } from "../api/index";

describe("Spec on account ", () => {
  const dsx = new DsxExchange({
    verbose: true,
    secretKey: "56789",
    apiKey: "56789"
  });

  it("transfer status", async () => {
    const res = await dsx.transferStatus(1878580);

    console.log(JSON.stringify(res));
  });
});
