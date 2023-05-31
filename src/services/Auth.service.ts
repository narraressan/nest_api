import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { UserAuth } from 'src/db/entities/Auth.entity';
import {
  JwtPayloadDto,
  LoginInputDto,
  LoginOutputDto,
  RegisterInputDto,
  ReLoginInputDto,
} from 'src/dto/Auth.dto';
import { cast, getHashFromText, getServerTime } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: EntityManager,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInputDto) {
    const newUser = new UserAuth();
    newUser.email = input.email.trim().toLowerCase();
    newUser.fullname = input.fullname?.trim();
    newUser.password = await getHashFromText(input.password.trim());
    await this.db.persistAndFlush(newUser);
  }

  async login(input: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.db.findOneOrFail(UserAuth, {
      email: {
        $ilike: input.email.trim(),
      },
      removedAt: null,
    });
    const isMatch = await bcrypt.compare(input.password, user.password);
    if (user && isMatch) {
      const params = await this.prepareAccessTokenPayload(user);
      const accessToken = await this.generateAccessToken(params);
      const refreshToken = await this.generateRefreshToken(params);

      return await cast(LoginOutputDto, {
        accessToken,
        refreshToken,
      });
    } else throw new NotFoundException();
  }

  async refreshToken(input: ReLoginInputDto): Promise<LoginOutputDto> {
    try {
      await this.jwtService.verify(input.refreshToken);
      const jwt = await cast(
        JwtPayloadDto,
        this.jwtService.decode(input.refreshToken) as object,
      );
      const user = await this.db.findOneOrFail(UserAuth, {
        email: jwt.email,
        removedAt: null,
      });
      const params = await this.prepareAccessTokenPayload(user);
      const accessToken = await this.generateAccessToken(params);

      return await cast(LoginOutputDto, {
        accessToken,
        refreshToken: input.refreshToken,
      });
    } catch (error) {
      console.log(error);
      if (error?.name === 'TokenExpiredError')
        throw new UnauthorizedException();
      throw new NotFoundException();
    }
  }

  async verify(token: JwtPayloadDto): Promise<UserAuth> {
    try {
      return await this.db.findOneOrFail(UserAuth, {
        email: token.email,
        removedAt: null,
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  async prepareAccessTokenPayload(user: UserAuth): Promise<JwtPayloadDto> {
    return await cast(JwtPayloadDto, {
      email: user.email,
      role: user.role,
      timestamp: getServerTime().toString(),
    });
  }

  async generateAccessToken(payload: JwtPayloadDto): Promise<string> {
    return this.jwtService.sign(instanceToPlain(payload), {
      expiresIn: process.env.JWT_LIFESPAN,
    });
  }

  async generateRefreshToken(payload: JwtPayloadDto): Promise<string> {
    return this.jwtService.sign(instanceToPlain(payload), {
      expiresIn: process.env.JWT_REFRESH_LIFESPAN,
    });
  }
}
