import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // TODO: Day 2 — implement GET /orders (and other endpoints)
}
