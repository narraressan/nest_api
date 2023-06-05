import {
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { LoggerMiddleware } from 'src/middlewares/Logger.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CacheInterceptor } from '@nestjs/cache-manager';
import ThrottleConfig from 'src/config/Throttle.config';
import JwtConfig from 'src/config/Jwt.config';
import HttpConfig from 'src/config/Axios.config';
import MulterConfig from 'src/config/Multer.config';
import CacheConfig from 'src/config/Cache.config';
import QueueConfig from 'src/config/Queue.config';
import { ReactionMeterInterceptor } from 'src/interceptors/ReactionMeter.interceptor';
import { AuthModule } from './Auth.module';
import { HealthModule } from './Health.module';
import { FileModule } from './Files.module';
import { AuthService } from 'src/services/Auth.service';
import { JwtStrategy } from 'src/guards/Auth.guard';
import { ExamplesModule } from './Examples.module';

const common = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  MikroOrmModule.forRoot(),
  PassportModule,
  ThrottleConfig,
  HttpConfig,
  JwtConfig,
  MulterConfig,
  CacheConfig,
  QueueConfig,
];

@Global()
@Module({
  imports: [...common, AuthModule, HealthModule, FileModule, ExamplesModule],
  exports: [...common, AuthService],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ReactionMeterInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    JwtStrategy,
    AuthService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
