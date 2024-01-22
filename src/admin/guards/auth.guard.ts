import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new UnauthorizedException('User unauthorized');
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('User unauthorized');
      }

      const userToken = this.tokenService.validateAccessToken(token);

      const user = await this.userService.getUserByToken(userToken);

      req.currentUser = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException('User unauthorized');
    }
  }
}
