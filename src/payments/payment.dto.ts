import {IsNotEmpty,IsNumber,IsString,Length,IsPositive,IsUUID} from 'class-validator'

export class createPaymentDto{
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2})
    orderNumber!:number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive({message:"Amount should be positive "})
    amount!:number;

    @IsNotEmpty()
    merchantRequestId!: string;

    @IsNotEmpty()
    checkoutRequestId: string;

    @IsNotEmpty()
    @IsString()
    @Length(12, 12, { message: 'Phone number must be exactly 12 characters (e.g., 2547XXXXXXXX)' })
    phoneNumber:string;

    @IsNotEmpty()
    resultDesc:string;

}