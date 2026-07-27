import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  // TODO: Day 2 — imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService],
  // TODO: Day 2 — exports: [OrderService],
})
export class OrderModule {}
