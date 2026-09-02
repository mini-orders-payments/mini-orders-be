import { Module,forwardRef} from '@nestjs/common';
import { DarajaService } from './daraja.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { OrderModule } from '@/orders/order.module';
import { DarajaAuthService } from './darajaAuth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    forwardRef(()=>OrderModule), 
  ],
  controllers:[PaymentController],
  providers: [DarajaService,DarajaAuthService],
  exports: [DarajaService],
})
export class PaymentModule {}
