import {IsNotEmpty,IsNumber,IsString,IsEnum,IsPositive,IsUUID} from 'class-validator'

export enum OrderStatus{
    PENDING='PENDING',
    COMPLETED='COMPLETED',
    FAILED='FAILED'

}

export class CreateOrderDto{
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2})
    orderNumber!:number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive({message:"Amount should be positive "})
    amount!:number;

    @IsNotEmpty()
    @IsEnum(OrderStatus, { message: 'Status must be PENDING, COMPLETED, or FAILED' })
    status!: OrderStatus;

}

export class UpdateOrderDto{
    @IsNotEmpty()
    @IsEnum(OrderStatus, { message: 'Status must be PENDING, COMPLETED, or FAILED' })
    status!: OrderStatus;


}

