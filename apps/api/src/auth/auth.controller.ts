import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }

  @Post('login-pin')
  async loginPin(@Body() body: any) {
    const user = await this.authService.validatePin(body.pin);
    if (!user) {
      throw new UnauthorizedException('PIN inválido');
    }
    return this.authService.login(user);
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    // Este endpoint se usará para refrescar el estado del usuario si ya tiene token
    return req.user;
  }
}
