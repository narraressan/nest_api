import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/Auth.controller';

@Module({
  controllers: [AuthController],
  imports: [],
  providers: [],
})
export class AuthModule {}
