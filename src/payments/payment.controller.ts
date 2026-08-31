import { Body, Controller, HttpCode, HttpStatus, Post ,Get,Param,ParseIntPipe,Delete, Injectable, } from '@nestjs/common';
import { DarajaService } from './daraja.service';
import { Payment } from './payment.entity';
import { OrderService } from 'src/orders/order.service';
import { createPaymentDto } from './payment.dto';


@Controller("pay")
export class PaymentController{
    constructor(
        private readonly DarajaService:DarajaService,
        private readonly orderService:OrderService        
     ){}
    

  @Post(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async payOrder(@Param('id',ParseIntPipe)id:number,@Body('phoneNumber',)phoneNumber:string){
    
    return await this.DarajaService.payForOrder(id,phoneNumber)
  }

  @Get('order/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async getPayment(@Param('id',ParseIntPipe)id:number){
    return await this.DarajaService.getPaymentByOrderId(id);
  }


@Post('mpesa/callback')
@HttpCode(HttpStatus.OK)
async handleCallback(@Body() body: any) {
  const stkCallback = body.Body.stkCallback;
  const checkoutRequestId = stkCallback.CheckoutRequestID;
  const resultCode = stkCallback.ResultCode; // 0 = success, anything else = failed/cancelled

  await this.DarajaService.handleDarajaCallback(checkoutRequestId, resultCode, stkCallback);

  // Always respond 200 with this exact shape — Safaricom retries if you don't.
  return { ResultCode: 0, ResultDesc: 'Accepted' };
}

}