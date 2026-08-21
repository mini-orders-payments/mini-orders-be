import { Module ,forwardRef} from "@nestjs/common";
import { User } from "./user.entity";
import { AuthService } from "./auth.service";
import { Userservice } from "./user.service";
import { OrderModule } from "src/orders/order.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule,ConfigService } from "@nestjs/config";
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    OrderModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, Userservice],
  exports: [Userservice], // OrderService/DarajaService may need user lookups later
})
export class AuthModule {}