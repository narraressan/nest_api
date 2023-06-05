import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/Auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
