import { Body, Controller, HttpCode, HttpStatus, Post ,Get,Param,ParseIntPipe,Request, UnauthorizedException, UseGuards, } from '@nestjs/common';
import { DarajaService } from './daraja.service';
import { Payment } from './payment.entity';
import { OrderService } from 'src/orders/order.service';
import { createPaymentDto } from './payment.dto';
import { Order } from 'src/orders/order.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';


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

  @UseGuards(JwtAuthGuard)
  @Get('order/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async getPayment(@Param('id',ParseIntPipe)id:number,@Request() req:any){

    const payment= await this.DarajaService.getPaymentByOrderId(id);
    if (!payment) return null;

    const order= await this.orderService.getOrderbyID(id)

    if (order.userId !==req.userId ){
      
      throw new UnauthorizedException("You do not have permission to view this payment.");
    
    }

    return {
      paymentCode: payment.paymentCode,
      resultDesc: payment.resultDesc,
      status: payment.status
    };
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