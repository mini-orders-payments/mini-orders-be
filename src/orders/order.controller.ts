import { Body, Controller, HttpCode, HttpStatus, Post ,Get,Param,ParseIntPipe,Delete } from '@nestjs/common';
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


  @Post(':id/edit')
  @HttpCode(HttpStatus.OK)
  async editOrder(@Param('id',ParseIntPipe)id:number,@Body() body: { amount: number }){
    return await this.orderService.editOrder(id,body.amount)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteOrder(@Param('id',ParseIntPipe)id:number){
    return await this.orderService.deleteOrder(id)
  }

  
}
