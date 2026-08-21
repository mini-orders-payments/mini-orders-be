import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { Order } from "src/orders/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderService } from "src/orders/order.service";

export enum OrderStatus{
    pending='pending',
    completed='completed',
    failed='failed'

}

@Injectable()
export class Userservice{
    constructor(
        @InjectRepository(User) private readonly userRepository:Repository<User>,
         private readonly orderService:OrderService,

    ){}

async getProfileWithOrderStats(userId: number) {
  const user = await this.userRepository.findOneOrFail({ where: { id: userId } });
  const orders = await this.orderService.getOrdersByUserId(userId);

  const stats = {
    completed: orders.filter((o) => o.status === OrderStatus.completed).length,
    failed: orders.filter((o) => o.status === OrderStatus.failed).length,
    pending: orders.filter((o) => o.status === OrderStatus.pending).length,
    all: orders.length,
  };

  return { id: `${user.id}`,phone:`${user.phoneNumber}`,name: `${user.firstName} ${user.lastName}`, email: user.email, stats };
}

async getUserOrders(userId:number){
  const user = await this.userRepository.findOneOrFail({ where: { id: userId } });
  const orders = await this.orderService.getOrdersByUserId(userId);

  return orders

}
}