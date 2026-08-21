import {IsNotEmpty,IsNumber,IsString,IsEnum,IsPositive,IsUUID} from 'class-validator'

export enum OrderStatus{
    pending='pending',
    completed='completed',
    failed='failed'

}

export class CreateOrderDto{

    @IsNotEmpty()
    @IsNumber()
    @IsPositive({message:"Amount should be positive "})
    amount!:number;

    @IsNotEmpty()
    @IsEnum(OrderStatus, { message: 'Status must be pending, completed, or failed' })
    status!: OrderStatus;

}

export class UpdateOrderDto{
    @IsNotEmpty()
    @IsEnum(OrderStatus, { message: 'Status must be pending, completed, or failed' })
    status!: OrderStatus;


}

