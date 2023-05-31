import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { JwtPayloadDto } from 'src/dto/Auth.dto';
import { AuthService } from 'src/services/Auth.service';
import { UserAuth } from 'src/db/entities/Auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(token: JwtPayloadDto): Promise<UserAuth> {
    return await this.authService.verify(token);
  }
}

@Injectable()
export class IsPrivateApi extends AuthGuard('jwt') {}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
