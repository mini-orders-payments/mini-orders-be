import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './order.entity';
import { Repository } from "typeorm"
import { CreateOrderDto } from './orders.dto';



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
    const order= await this.orderRepository.findOne({where :{id}});

    if (!order){
      throw new NotFoundException(`Order ${id} not found`)
    }
    return order;

  }
  async getAllOrders():Promise<Order[]>{
    return await this.orderRepository.find()
  }

}
