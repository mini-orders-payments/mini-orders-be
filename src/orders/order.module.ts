import { Module, forwardRef} from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { PaymentModule } from '@/payments/payment.module';

@Module({
  imports:[TypeOrmModule.forFeature([Order]),forwardRef(()=>PaymentModule)],
  
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService],
})
export class OrderModule {}
