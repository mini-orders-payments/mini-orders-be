import { Injectable } from '@nestjs/common';

@Injectable()
export class DarajaService {
  /**
   * Mock STK Push — returns fake Safaricom-style IDs after a short delay.
   * TODO: Day 3 — intern wires this into the real payment flow (replace mock
   * with actual Daraja / Safaricom M-Pesa API calls).
   */
  async initiateSTKPush(
    orderId: string,
    amount: number,
  ): Promise<{ merchantRequestId: string; checkoutRequestId: string }> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    return {
      merchantRequestId: `mock-merchant-${orderId}-${amount}`,
      checkoutRequestId: `mock-checkout-${Date.now()}`,
    };
  }
}
