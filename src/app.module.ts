import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { OrderModule } from './orders/order.module';
import { PaymentModule } from './payments/payment.module';
import { Order } from './orders/order.entity';
import { Payment } from './payments/payment.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>(
          'DB_DATABASE',
          'mini_order_payments',
        ),
        autoLoadEntities: true,
        entities: [Order,Payment,User],
            

        synchronize: true, // TODO: Day 2+ — turn off in production; fine for local scaffolding
      }),
    }),
    HealthModule,
    OrderModule,
    PaymentModule,
    AuthModule
  ],
})
export class AppModule {}
