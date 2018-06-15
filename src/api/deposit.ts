import { Exchange } from "./exchange";

export interface Transfer {
  id: number;
  timestamp: number;
  type: string;
  amount: number;
  currency: string;
  address: string;
  status: number;
  commission: number;
  txid: string;
}

export class ExchangeDeposit extends Exchange {
  /**
   * @param id
   */
  async transferStatus(id: number): Promise<Transfer> {
    const res: { success: number; return: Transfer } = await this.request(
      this.sign("transaction/status", "dwapi", "POST", { id })
    );
    if (res.success != 1) {
      throw res;
    }
    return res.return;
  }

  // implement...
}
