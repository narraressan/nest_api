import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  LoginInputDto,
  LoginOutputDto,
  RegisterInputDto,
  ReLoginInputDto,
} from 'src/dto/Auth.dto';
import { AuthService } from 'src/services/Auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() input: RegisterInputDto) {
    await this.authService.register(input);
    return HttpStatus.OK;
  }

  @Post('login')
  async login(@Body() input: LoginInputDto): Promise<LoginOutputDto> {
    return await this.authService.login(input);
  }

  @ApiBearerAuth()
  @Post('refresh')
  async refresh(@Body() input: ReLoginInputDto): Promise<LoginOutputDto> {
    return await this.authService.refreshToken(input);
  }
}
