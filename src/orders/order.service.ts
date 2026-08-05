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
    
  ){}


  async createNewOrder(dto:CreateOrderDto): Promise<Order>{

    const neworder=this.orderRepository.create(dto);

    return await this.orderRepository.save(neworder)

  }

  async getOrderbyID(id:number):Promise<Order>{
    const order= await this.orderRepository.findOne({where: { id: id }});

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
  async editOrder(id:number, amount:number):Promise<Order>{
    const order= await this.orderRepository.findOne({where :{id}});

    if (!order){
      throw new NotFoundException(`Order ${id} not found`)
    }
    else{

       order.amount = amount;

      return await this.orderRepository.save(order)
    }
  }

  async deleteOrder(id:number):Promise<{id:number; msg:string}>{
    await this.orderRepository.delete(id);

    return {
      id:id,
      msg: " Order deleted successfully"
    }
  }

}
