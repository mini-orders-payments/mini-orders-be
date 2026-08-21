import { IsNotEmpty,IsString,IsStrongPassword,IsEmail,MinLength } from "class-validator";

export class SignupDto{
    @IsNotEmpty()
    @IsString()
    firstName:string;

    @IsNotEmpty()
    @IsString()
    lastName:string;

    @IsString()
    @IsNotEmpty()
    phoneNumber:string;

    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @MinLength(8)
    password:string;

}

export class SigninDto{
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    password:string;
}