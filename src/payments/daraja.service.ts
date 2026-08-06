import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderService } from 'src/orders/order.service';
import { Order } from 'src/orders/order.entity';
import { OrderStatus } from 'src/orders/order.entity';
import { createPaymentDto } from './payment.dto';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import { DarajaAuthService } from './darajaAuth.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { StringDecoder } from 'node:string_decoder';


export type pay={
    id:number;
    orderNumber:number;
    amount:number;
    merchantRequestId:string;
    checkoutRequestId:string
  }

@Injectable()
export class DarajaService {
  constructor(
    
    @InjectRepository(Payment)
    private readonly paymentRepository:Repository<Payment> ,
    private readonly orderService:OrderService,
    private readonly auth:DarajaAuthService,
    private readonly config:ConfigService

 ){}
  
  async initiateSTKPush(phoneNumber:string,orderId: number,amount: number): Promise<{ merchantRequestId: string; checkoutRequestId: string ,phoneNumber:string,result:string }> {
    

   try{
    const token = await this.auth.getAccessToken();

    const shortcode = this.config.get<string>('DARAJA_SHORTCODE');
    const passkey = this.config.get<string>('DARAJA_PASSKEY');
    const timestamp = this.generateTimestamp();

    // Password = base64(Shortcode + Passkey + Timestamp) 
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline', // or CustomerBuyGoodsOnline for a till
      Amount: Math.round(amount), // Daraja sandbox rejects decimals
      PartyA: phoneNumber,        // customer's phone, format 2547XXXXXXXX
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: this.config.get('DARAJA_CALLBACK_URL'), // I use 'ngrok http 3000' to foward the backend to a live server
      AccountReference: orderId,  // shows on the customer's prompt 
      TransactionDesc: 'Order payment',
    };

    const { data } = await axios.post(
      `${this.config.get('DARAJA_BASE_URL')}/mpesa/stkpush/v1/processrequest`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } },
    );
   
    
    return {
      phoneNumber:phoneNumber,
      merchantRequestId: data.MerchantRequestID,
      checkoutRequestId: data.CheckoutRequestID,
      result:data.ResultDesc

    };}
      catch (error: any) {
      if (error.response) {
        console.error(" Safaricom Rejection Reason:", error.response.data);
      } else {
        console.error(" Network Connection Failure:", error.message);
      }
      throw new Error(`Daraja API Gateway Refused Transaction: ${error.message}`);
    }
  }

  private generateTimestamp(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }
  

  async payForOrder(ID:number,phoneNumber:string):Promise< {order: Order; paymentdata: any }>{
    const order= await this.orderService.getOrderbyID(ID)
    
    const id =order.id
    const amount=order.amount
    const status =order.status
    
    try{
      const res=await this.initiateSTKPush(phoneNumber,id,amount,)
      
      const updatedOrder=await this.orderService.updateOrder(id,OrderStatus.completed)

      const populatedb= await this.createNewPayment({
        orderNumber:updatedOrder.id,
        amount:updatedOrder.amount,
        phoneNumber:res.phoneNumber,
        checkoutRequestId:res.checkoutRequestId,
        merchantRequestId:res.merchantRequestId,
        resultDesc:res.result
        })

      return {
        order:updatedOrder,
        paymentdata:res
      }

    }
    catch(error){
      console.error(error);
      throw error;
    }
    
  }
  async createNewPayment(dto:createPaymentDto): Promise<Payment>{
  
      const newpayment=this.paymentRepository.create(dto);
  
      return await this.paymentRepository.save(newpayment)
  
    }

  async handleDarajaCallback(checkoutRequestId: string, resultCode: number, raw: any,){
  const payment = await this.paymentRepository.findOne({ where: { checkoutRequestId } });
  if (!payment) return;

  if (resultCode === 0) {
    const items = raw.CallbackMetadata.Item as { Name: string; Value: any }[];
    const get = (name: string) => items.find((i) => i.Name === name)?.Value;

    payment.paymentCode = get('MpesaReceiptNumber');
    await this.paymentRepository.save(payment);
    
    await this.orderService.updateOrder(payment.orderNumber, OrderStatus.completed);
  } else {
    
    await this.paymentRepository.save(payment);
    

    await this.orderService.updateOrder(payment.orderNumber, OrderStatus.failed);
  }
}
}
