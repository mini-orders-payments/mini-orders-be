import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './order.entity';
import { Repository } from "typeorm"
import { CreateOrderDto,OrderStatus,UpdateOrderDto } from './orders.dto';
import { DarajaService } from 'src/payments/daraja.service';



@Injectable()
export class OrderService {
  constructor (
    @InjectRepository(Order)
    private readonly orderRepository : Repository <Order>,
    private readonly Darajaservice:DarajaService,
  ){}


  async createNewOrder(dto:CreateOrderDto): Promise<Order>{

    const neworder=this.orderRepository.create(dto);

    return await this.orderRepository.save(neworder)

  }

  async getOrderbyID(id:number):Promise<Order>{
    const order= await this.orderRepository.findOne({where :{id}});

    if (!order){
      throw new NotFoundException(`Order ${id} not found`)
    }
    return order;

  }
  async getAllOrders():Promise<Order[]>{
    return await this.orderRepository.find()
  }

  async updateOrder(id:number, status:string):Promise<Order>{
    const order= await this.orderRepository.findOne({where :{id}});

    if (!order){
      throw new NotFoundException(`Order ${id} not found`)
    }
    else{

       order.status = status as OrderStatus;

      return await this.orderRepository.save(order)
    }


    
  }

  async payForOrder(ID:number):Promise< {order: Order; paymentdata: any }>{
    const order= await this.getOrderbyID(ID)
    
    const id =order.id
    const amount=order.amount
    const status =order.status
    
    try{
      const res=await this.Darajaservice.initiateSTKPush(id,amount)
      
      const updatedOrder=await this.updateOrder(id,OrderStatus.COMPLETED)

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

}
