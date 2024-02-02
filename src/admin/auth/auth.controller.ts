import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { LoginDto } from './dto/userLogin.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('auth')
@Controller('/admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: CreateUserDto, description: 'Data to create user' })
  @ApiCreatedResponse({ type: CreateUserDto, description: 'User created' })
    @UseGuards(AuthGuard)
  @Post('/registration')
  async registration(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto);
  }

  @ApiBody({ type: LoginDto, description: 'Data to login' })
  @ApiCreatedResponse({ type: LoginDto, description: 'User logged in' })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.authService.loginUser(loginDto);
    res.cookie('refreshToken', user.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json({
      message: 'System user login successfully!',
      user: user.user,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    });
  }

  @ApiOkResponse({ type: UserEntity, description: 'User tokens refreshed' })
  @Get('refresh')
  async refresh(@Req() req, @Res() res) {
    const refreshToken = req.cookies['refreshToken'];
    const user = await this.authService.refreshToken(refreshToken);
    res.cookie('refreshToken', user.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json({
      message: 'System user tokens refreshed successfully!',
      user: user.user,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    });
  }

  @ApiOkResponse({ description: 'User logged out' })
  @Post('logout')
  logout(@Req() req, @Res() res) {
    const refreshToken = req.cookies['refreshToken'];
    this.authService.logoutUser(refreshToken);
    res.clearCookie('refreshToken');
    res.status(200).json({
      message: 'Log out successfully!',
    });
  }
}
