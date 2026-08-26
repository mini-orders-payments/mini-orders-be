import { Controller,Post,Body,UseGuards,Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard";
import { SignupDto,SigninDto } from "./auth.dto";
import { CurrentUser } from "./jwt/current-user.decorator";
import { Userservice } from "./user.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: Userservice) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: { id: number; email: string }) {
    return this.userService.getProfileWithOrderStats(user.id); // Frame 8's data
  }
  
}