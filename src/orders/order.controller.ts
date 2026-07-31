import { Body, Controller, HttpCode, HttpStatus, Post ,Get,Param,ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './orders.dto';
import { Order } from './order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto:CreateOrderDto):Promise<Order>{
    return await this.orderService.createNewOrder(dto)

  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findall():Promise<Order[]>{
    return await this.orderService.getAllOrders()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findbyId(@Param('id', ParseIntPipe)id:number):Promise<Order>{
    return await this.orderService.getOrderbyID(id)
  }

  @Post(':id/pay')
  @HttpCode(HttpStatus.ACCEPTED)
  async payOrder(@Param('id',ParseIntPipe)id:number){
    
    return await this.orderService.payForOrder(id)
  }
  
}
