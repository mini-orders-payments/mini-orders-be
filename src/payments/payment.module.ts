import { Module } from '@nestjs/common';
import { DarajaService } from './daraja.service';

@Module({
  // TODO: Day 3 — add PaymentController / PaymentService and wire DarajaService into the payment flow
  
  providers: [DarajaService],
  exports: [DarajaService],
})
export class PaymentModule {}
