import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { TokenDto } from '../token/dto/token.dto';
import { LoginDto } from './dto/userLogin.dto';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private tokenService: TokenService,
  ) {}

  async registerUser(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { name: dto.name },
    });

    if (existingUser)
      throw new ConflictException(`User with name ${dto.name} already exists!`);

    const hashedPassword = await hash(dto.password);
    dto.password = hashedPassword;
    const user = this.userRepository.create(dto);

    const tokenDto = new TokenDto(user);

    const tokens = this.tokenService.generateTokens({ ...tokenDto });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);
    await this.userRepository.save(user);

    return {
      message: 'User registration successful!',
      user: user,
      ...tokens,
    };
  }

  async loginUser(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { name: dto.name },
    });
    if (!user)
      throw new NotFoundException(`User with ${dto.name} not found!`);

    const isPasswordValid = await verify(user.password, dto.password);
    if (!isPasswordValid)
      throw new NotFoundException(`User password incorrect!`);

    const tokens = this.tokenService.generateTokens(new TokenDto(user));

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    return {
      message: 'User login successful!',
      user: user,
      ...tokens,
    };
  }

  async logoutUser(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException();
    await this.tokenService.deleteToken(refreshToken);
    return {
      message: 'User logged out!',
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException();
    const tokenFromDB = await this.tokenService.findToken(refreshToken);
    const validToken = this.tokenService.validateRefreshToken(refreshToken);
    if (!validToken && !tokenFromDB) throw new UnauthorizedException();
    const user = await this.userRepository.findOne({
      where: { id: validToken.id },
    });
    const tokens = this.tokenService.generateTokens(new TokenDto(user));
    await this.tokenService.saveTokens(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: new TokenDto(user),
    };
  }
}